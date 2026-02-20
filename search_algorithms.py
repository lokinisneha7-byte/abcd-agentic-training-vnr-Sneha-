"""
Search Algorithms Implementation in Python
==========================================
Implements the following search/similarity algorithms:
  1. Cosine Similarity Search
  2. Euclidean Distance Search
  3. Manhattan Distance Search
  4. Jaccard Similarity Search
  5. BM25 (Best Match 25) Search
"""

from __future__ import annotations

import math
import re
from collections import Counter, defaultdict
from typing import Dict, List, Tuple


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def preprocess(text: str) -> List[str]:
    """Lowercase and tokenize text into words."""
    return re.findall(r"\w+", text.lower())


def build_tfidf_vector(doc_tokens: List[str], vocab: List[str]) -> List[float]:
    """Build a simple TF vector over a fixed vocabulary."""
    freq = Counter(doc_tokens)
    total = len(doc_tokens) if doc_tokens else 1
    return [freq.get(word, 0) / total for word in vocab]


def build_vocab(corpus: List[str]) -> List[str]:
    """Build sorted vocabulary from a corpus."""
    vocab = set()
    for doc in corpus:
        vocab.update(preprocess(doc))
    return sorted(vocab)


# ===========================================================================
# 1. COSINE SIMILARITY SEARCH
# ===========================================================================

class CosineSimilaritySearch:
    """
    Measures the cosine of the angle between two vectors.
    Score = 1.0 means identical direction (most similar).
    Score = 0.0 means orthogonal (no similarity).

    Formula:
        cosine(A, B) = (A . B) / (||A|| x ||B||)
    """

    def __init__(self, corpus: List[str]):
        self.corpus = corpus
        self.vocab = build_vocab(corpus)
        self.doc_vectors = [
            build_tfidf_vector(preprocess(doc), self.vocab)
            for doc in corpus
        ]

    def _cosine(self, a: List[float], b: List[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = math.sqrt(sum(x ** 2 for x in a))
        mag_b = math.sqrt(sum(x ** 2 for x in b))
        return dot / (mag_a * mag_b) if mag_a and mag_b else 0.0

    def search(self, query: str, top_k: int = 3) -> List[Tuple[float, str]]:
        q_vec = build_tfidf_vector(preprocess(query), self.vocab)
        scores = [
            (self._cosine(q_vec, doc_vec), doc)
            for doc_vec, doc in zip(self.doc_vectors, self.corpus)
        ]
        return sorted(scores, reverse=True)[:top_k]


# ===========================================================================
# 2. EUCLIDEAN DISTANCE SEARCH
# ===========================================================================

class EuclideanDistanceSearch:
    """
    Measures straight-line distance between two vectors in n-dimensional space.
    Lower distance = more similar documents.

    Formula:
        euclidean(A, B) = sqrt(Sum (a_i - b_i)^2)
    """

    def __init__(self, corpus: List[str]):
        self.corpus = corpus
        self.vocab = build_vocab(corpus)
        self.doc_vectors = [
            build_tfidf_vector(preprocess(doc), self.vocab)
            for doc in corpus
        ]

    def _euclidean(self, a: List[float], b: List[float]) -> float:
        return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

    def search(self, query: str, top_k: int = 3) -> List[Tuple[float, str]]:
        q_vec = build_tfidf_vector(preprocess(query), self.vocab)
        scores = [
            (self._euclidean(q_vec, doc_vec), doc)
            for doc_vec, doc in zip(self.doc_vectors, self.corpus)
        ]
        return sorted(scores)[:top_k]


# ===========================================================================
# 3. MANHATTAN DISTANCE SEARCH
# ===========================================================================

class ManhattanDistanceSearch:
    """
    Also known as L1 distance or taxicab distance.
    Sum of absolute differences between vector components.
    Lower distance = more similar documents.

    Formula:
        manhattan(A, B) = Sum |a_i - b_i|
    """

    def __init__(self, corpus: List[str]):
        self.corpus = corpus
        self.vocab = build_vocab(corpus)
        self.doc_vectors = [
            build_tfidf_vector(preprocess(doc), self.vocab)
            for doc in corpus
        ]

    def _manhattan(self, a: List[float], b: List[float]) -> float:
        return sum(abs(x - y) for x, y in zip(a, b))

    def search(self, query: str, top_k: int = 3) -> List[Tuple[float, str]]:
        q_vec = build_tfidf_vector(preprocess(query), self.vocab)
        scores = [
            (self._manhattan(q_vec, doc_vec), doc)
            for doc_vec, doc in zip(self.doc_vectors, self.corpus)
        ]
        return sorted(scores)[:top_k]


# ===========================================================================
# 4. JACCARD SIMILARITY SEARCH
# ===========================================================================

class JaccardSimilaritySearch:
    """
    Measures overlap between two sets of words.
    Works directly on token sets - no vector needed.
    Score = 1.0 means identical sets; 0.0 means no overlap.

    Formula:
        jaccard(A, B) = |A intersect B| / |A union B|
    """

    def __init__(self, corpus: List[str]):
        self.corpus = corpus
        self.doc_sets = [set(preprocess(doc)) for doc in corpus]

    def _jaccard(self, set_a: set, set_b: set) -> float:
        intersection = len(set_a & set_b)
        union = len(set_a | set_b)
        return intersection / union if union else 0.0

    def search(self, query: str, top_k: int = 3) -> List[Tuple[float, str]]:
        q_set = set(preprocess(query))
        scores = [
            (self._jaccard(q_set, doc_set), doc)
            for doc_set, doc in zip(self.doc_sets, self.corpus)
        ]
        return sorted(scores, reverse=True)[:top_k]


# ===========================================================================
# 5. BM25 SEARCH (Best Match 25)
# ===========================================================================

class BM25Search:
    """
    Probabilistic ranking function used by search engines like Elasticsearch.
    Improves on TF-IDF by penalizing very long documents and capping term frequency.

    Parameters:
        k1  - term frequency saturation (default 1.5)
        b   - length normalization (default 0.75)
    """

    def __init__(self, corpus: List[str], k1: float = 1.5, b: float = 0.75):
        self.corpus = corpus
        self.k1 = k1
        self.b = b
        self.tokenized_corpus = [preprocess(doc) for doc in corpus]
        self.N = len(corpus)
        self.avgdl = sum(len(d) for d in self.tokenized_corpus) / self.N if self.N else 1
        self.df: Dict[str, int] = self._compute_df()

    def _compute_df(self) -> Dict[str, int]:
        df: Dict[str, int] = defaultdict(int)
        for tokens in self.tokenized_corpus:
            for term in set(tokens):
                df[term] += 1
        return df

    def _idf(self, term: str) -> float:
        n = self.df.get(term, 0)
        return math.log((self.N - n + 0.5) / (n + 0.5) + 1)

    def _score(self, query_tokens: List[str], doc_tokens: List[str]) -> float:
        tf = Counter(doc_tokens)
        dl = len(doc_tokens)
        score = 0.0
        for term in query_tokens:
            if term not in tf:
                continue
            idf = self._idf(term)
            tf_val = tf[term]
            numerator = tf_val * (self.k1 + 1)
            denominator = tf_val + self.k1 * (1 - self.b + self.b * dl / self.avgdl)
            score += idf * (numerator / denominator)
        return score

    def search(self, query: str, top_k: int = 3) -> List[Tuple[float, str]]:
        q_tokens = preprocess(query)
        scores = [
            (self._score(q_tokens, doc_tokens), doc)
            for doc_tokens, doc in zip(self.tokenized_corpus, self.corpus)
        ]
        return sorted(scores, reverse=True)[:top_k]


# ===========================================================================
# DEMO
# ===========================================================================

def print_results(algo_name: str, results: List[Tuple[float, str]], ascending=False):
    label = "distance" if ascending else "score"
    print(f"\n{'-'*55}")
    print(f"  {algo_name}")
    print(f"{'-'*55}")
    for rank, (score, doc) in enumerate(results, 1):
        print(f"  #{rank} [{label}: {score:.4f}] {doc[:60]}")


if __name__ == "__main__":
    corpus = [
        "machine learning is a subset of artificial intelligence",
        "deep learning uses neural networks with many layers",
        "natural language processing helps computers understand text",
        "cosine similarity measures the angle between two vectors",
        "search engines use ranking algorithms to return relevant results",
        "BM25 is a probabilistic model used in information retrieval",
        "python is a popular language for data science and machine learning",
        "vector space models represent documents as numerical vectors",
        "euclidean distance measures straight line distance in space",
        "jaccard similarity compares the overlap between two sets",
    ]

    query = "machine learning and neural networks for language"

    print("=" * 55)
    print("  Search Algorithm Comparison")
    print(f"  Query: '{query}'")
    print("=" * 55)

    cosine = CosineSimilaritySearch(corpus)
    print_results("1. Cosine Similarity (higher = better)", cosine.search(query))

    euclidean = EuclideanDistanceSearch(corpus)
    print_results("2. Euclidean Distance (lower = better)", euclidean.search(query), ascending=True)

    manhattan = ManhattanDistanceSearch(corpus)
    print_results("3. Manhattan Distance (lower = better)", manhattan.search(query), ascending=True)

    jaccard = JaccardSimilaritySearch(corpus)
    print_results("4. Jaccard Similarity (higher = better)", jaccard.search(query))

    bm25 = BM25Search(corpus)
    print_results("5. BM25 Search (higher = better)", bm25.search(query))

    print("\n" + "=" * 55)
    print("  Done!")
    print("=" * 55)