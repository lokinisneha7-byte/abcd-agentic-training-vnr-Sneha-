"""
WordPiece Tokenization Algorithm - Python Implementation
=========================================================
WordPiece is a subword tokenization algorithm used by BERT and other
transformer models. It greedily builds a vocabulary by merging character
pairs that maximize the likelihood of the training data.

Algorithm Steps:
  1. Pre-tokenize text into words (whitespace/punctuation split)
  2. Start with a character-level vocabulary
  3. Iteratively merge the most frequent adjacent pair (weighted by likelihood)
  4. At inference, greedily match the longest subword from the vocabulary
     - Prefixes have no marker; continuations are prefixed with "##"
"""

from __future__ import annotations

import re
from collections import defaultdict
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def _pre_tokenize(text: str) -> List[str]:
    """Split text on whitespace and punctuation, lowercasing."""
    return re.findall(r"\w+|[^\w\s]", text.lower())


def _word_to_chars(word: str) -> List[str]:
    """Convert a word to its initial character sequence (## prefix for non-first)."""
    if not word:
        return []
    return [word[0]] + [f"##{c}" for c in word[1:]]


# ---------------------------------------------------------------------------
# Trainer
# ---------------------------------------------------------------------------

class WordPieceTrainer:
    def __init__(self, vocab_size: int = 1000, special_tokens: Optional[List[str]] = None):
        self.vocab_size = vocab_size
        self.special_tokens: List[str] = special_tokens or [
            "[PAD]", "[UNK]", "[CLS]", "[SEP]", "[MASK]"
        ]

    def train(self, corpus: List[str]) -> "WordPieceTokenizer":
        """Train on a list of sentences and return a fitted tokenizer."""
        # Step 1 – count word frequencies
        word_freq: Dict[str, int] = defaultdict(int)
        for sentence in corpus:
            for word in _pre_tokenize(sentence):
                word_freq[word] += 1

        # Step 2 – initialise vocab with special tokens + all unique chars
        vocab: Dict[str, int] = {}
        for tok in self.special_tokens:
            vocab[tok] = len(vocab)

        word_splits: Dict[str, List[str]] = {
            word: _word_to_chars(word) for word in word_freq
        }

        for pieces in word_splits.values():
            for p in pieces:
                if p not in vocab:
                    vocab[p] = len(vocab)

        # Step 3 – merge loop
        while len(vocab) < self.vocab_size:
            pair_scores = self._compute_pair_scores(word_freq, word_splits)
            if not pair_scores:
                break
            best_pair = max(pair_scores, key=pair_scores.__getitem__)
            merged = self._merge_token(best_pair)
            if merged not in vocab:
                vocab[merged] = len(vocab)
            word_splits = self._apply_merge(word_splits, best_pair, merged)

        return WordPieceTokenizer(vocab=vocab, special_tokens=self.special_tokens)

    @staticmethod
    def _compute_pair_scores(word_freq, word_splits):
        pair_freq: Dict[Tuple[str, str], int] = defaultdict(int)
        piece_freq: Dict[str, int] = defaultdict(int)

        for word, freq in word_freq.items():
            pieces = word_splits[word]
            for piece in pieces:
                piece_freq[piece] += freq
            for i in range(len(pieces) - 1):
                pair_freq[(pieces[i], pieces[i + 1])] += freq

        scores: Dict[Tuple[str, str], float] = {}
        for pair, freq in pair_freq.items():
            denom = piece_freq[pair[0]] * piece_freq[pair[1]]
            scores[pair] = freq / denom if denom else 0.0
        return scores

    @staticmethod
    def _merge_token(pair: Tuple[str, str]) -> str:
        a, b = pair
        return a + b.lstrip("#") if b.startswith("##") else a + b

    @staticmethod
    def _apply_merge(word_splits, pair, merged):
        a, b = pair
        new_splits = {}
        for word, pieces in word_splits.items():
            new_pieces, i = [], 0
            while i < len(pieces):
                if i < len(pieces) - 1 and pieces[i] == a and pieces[i + 1] == b:
                    new_pieces.append(merged)
                    i += 2
                else:
                    new_pieces.append(pieces[i])
                    i += 1
            new_splits[word] = new_pieces
        return new_splits


# ---------------------------------------------------------------------------
# Tokenizer (inference)
# ---------------------------------------------------------------------------

class WordPieceTokenizer:
    def __init__(self, vocab: Dict[str, int], special_tokens: Optional[List[str]] = None,
                 unk_token: str = "[UNK]", max_chars_per_word: int = 100):
        self.vocab = vocab
        self.id_to_token: Dict[int, str] = {v: k for k, v in vocab.items()}
        self.special_tokens = special_tokens or []
        self.unk_token = unk_token
        self.max_chars_per_word = max_chars_per_word

    def tokenize(self, text: str) -> List[str]:
        tokens = []
        for word in _pre_tokenize(text):
            tokens.extend(self._tokenize_word(word))
        return tokens

    def encode(self, text: str) -> List[int]:
        unk_id = self.vocab.get(self.unk_token, 0)
        return [self.vocab.get(tok, unk_id) for tok in self.tokenize(text)]

    def decode(self, ids: List[int]) -> str:
        tokens = [self.id_to_token.get(i, self.unk_token) for i in ids]
        return self._tokens_to_string(tokens)

    def vocab_size(self) -> int:
        return len(self.vocab)

    def _tokenize_word(self, word: str) -> List[str]:
        if len(word) > self.max_chars_per_word:
            return [self.unk_token]
        tokens, start = [], 0
        while start < len(word):
            end, found = len(word), False
            while start < end:
                candidate = word[start:end] if start == 0 else f"##{word[start:end]}"
                if candidate in self.vocab:
                    tokens.append(candidate)
                    start = end
                    found = True
                    break
                end -= 1
            if not found:
                return [self.unk_token]
        return tokens

    @staticmethod
    def _tokens_to_string(tokens: List[str]) -> str:
        out = []
        for tok in tokens:
            if tok.startswith("##"):
                out.append(tok[2:])
            else:
                out.append(" " + tok if out else tok)
        return "".join(out)


# ---------------------------------------------------------------------------
# Demo
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    corpus = [
        "the quick brown fox jumps over the lazy dog",
        "machine learning is a subset of artificial intelligence",
        "natural language processing helps computers understand text",
        "tokenization splits text into smaller meaningful units",
        "wordpiece builds a subword vocabulary from training data",
        "bert uses wordpiece tokenization for its input representation",
        "transformers have revolutionized natural language processing",
        "attention mechanisms allow models to focus on relevant tokens",
        "subword tokenization balances vocabulary size and coverage",
        "python is widely used for machine learning research",
    ]

    trainer = WordPieceTrainer(vocab_size=200)
    tokenizer = trainer.train(corpus)

    print(f"Vocab size: {tokenizer.vocab_size()}\n")

    test_sentences = [
        "the quick fox",
        "natural language understanding",
        "wordpiece tokenization example",
        "unknown xylophone",
    ]

    for sent in test_sentences:
        tokens  = tokenizer.tokenize(sent)
        ids     = tokenizer.encode(sent)
        decoded = tokenizer.decode(ids)
        print(f"Input  : {sent}")
        print(f"Tokens : {tokens}")
        print(f"IDs    : {ids}")
        print(f"Decoded: {decoded}")
        print()