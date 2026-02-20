"""
💼 Salary Predictor — Linear Regression Model
Predicts salary based on years of experience, education level, and job role.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────────────────────
# 1. GENERATE SYNTHETIC DATASET
# ─────────────────────────────────────────────────────────────
np.random.seed(42)
n = 300

job_roles   = ["Data Analyst", "Software Engineer", "ML Engineer", "Product Manager", "DevOps"]
edu_levels  = ["Bachelor's", "Master's", "PhD"]

experience  = np.random.randint(0, 20, n)
education   = np.random.choice(edu_levels, n)
job_role    = np.random.choice(job_roles,  n)

edu_bonus   = {"Bachelor's": 0, "Master's": 8000, "PhD": 18000}
role_bonus  = {
    "Data Analyst": 55000, "Software Engineer": 75000,
    "ML Engineer": 90000,  "Product Manager": 80000, "DevOps": 70000
}

salary = (
    np.array([role_bonus[r] for r in job_role])
    + np.array([edu_bonus[e] for e in education])
    + experience * 3000
    + np.random.normal(0, 5000, n)
).astype(int)

df = pd.DataFrame({
    "experience_years": experience,
    "education":        education,
    "job_role":         job_role,
    "salary":           salary
})

print("📊 Dataset Sample:")
print(df.head(10).to_string(index=False))
print(f"\nShape: {df.shape}")
print(f"Salary range: ${df['salary'].min():,} — ${df['salary'].max():,}")

# ─────────────────────────────────────────────────────────────
# 2. PREPROCESSING
# ─────────────────────────────────────────────────────────────
df_encoded = df.copy()
le_edu  = LabelEncoder()
le_role = LabelEncoder()
df_encoded["education"] = le_edu.fit_transform(df["education"])
df_encoded["job_role"]  = le_role.fit_transform(df["job_role"])

X = df_encoded[["experience_years", "education", "job_role"]]
y = df_encoded["salary"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"\n✅ Train size: {len(X_train)} | Test size: {len(X_test)}")

# ─────────────────────────────────────────────────────────────
# 3. TRAIN MODELS
# ─────────────────────────────────────────────────────────────
lr  = LinearRegression()
rid = Ridge(alpha=1.0)

lr.fit(X_train, y_train)
rid.fit(X_train, y_train)

y_pred_lr  = lr.predict(X_test)
y_pred_rid = rid.predict(X_test)

# ─────────────────────────────────────────────────────────────
# 4. EVALUATE
# ─────────────────────────────────────────────────────────────
def evaluate(name, y_true, y_pred):
    mae  = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2   = r2_score(y_true, y_pred)
    print(f"\n📈 {name}")
    print(f"   MAE  : ${mae:,.0f}")
    print(f"   RMSE : ${rmse:,.0f}")
    print(f"   R²   : {r2:.4f}")
    return r2

print("\n" + "="*45)
print("          MODEL EVALUATION RESULTS")
print("="*45)
r2_lr  = evaluate("Linear Regression", y_test, y_pred_lr)
r2_rid = evaluate("Ridge Regression",  y_test, y_pred_rid)

winner = "Linear Regression" if r2_lr > r2_rid else "Ridge Regression"
print(f"\n🏆 Best Model: {winner}")

# ─────────────────────────────────────────────────────────────
# 5. VISUALIZATIONS
# ─────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle("💼 Salary Predictor — Model Insights", fontsize=15, fontweight="bold", y=1.02)

# --- Plot 1: Actual vs Predicted ---
ax = axes[0]
ax.scatter(y_test, y_pred_lr, alpha=0.6, color="#4C72B0", edgecolors="white", linewidth=0.5, label="Predicted")
mn, mx = y_test.min(), y_test.max()
ax.plot([mn, mx], [mn, mx], "r--", linewidth=2, label="Perfect Prediction")
ax.set_title("Actual vs Predicted Salary", fontweight="bold")
ax.set_xlabel("Actual Salary ($)")
ax.set_ylabel("Predicted Salary ($)")
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.legend()
ax.grid(True, alpha=0.3)

# --- Plot 2: Average Salary by Role (clean bar chart) ---
ax = axes[1]
avg_by_role = df.groupby("job_role")["salary"].mean().sort_values(ascending=True)
colors_role = ["#4C72B0", "#DD8452", "#55A868", "#C44E52", "#8172B2"]
bars2 = ax.barh(avg_by_role.index, avg_by_role.values, color=colors_role, edgecolor="white", linewidth=1.2)
ax.set_title("Avg Salary by Job Role", fontweight="bold")
ax.set_xlabel("Average Salary ($)")
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
for bar, val in zip(bars2, avg_by_role.values):
    ax.text(bar.get_width() + 500, bar.get_y() + bar.get_height()/2,
            f"${val/1000:.1f}K", va="center", fontsize=9, fontweight="bold")
ax.grid(True, alpha=0.3, axis="x")
ax.set_xlim(0, avg_by_role.max() * 1.18)

# --- Plot 3: Average Salary by Education ---
ax = axes[2]
avg_by_edu = df.groupby("education")["salary"].mean().sort_values()
bars = ax.bar(avg_by_edu.index, avg_by_edu.values,
              color=["#4C72B0", "#DD8452", "#55A868"], edgecolor="white", linewidth=1.2)
ax.set_title("Avg Salary by Education Level", fontweight="bold")
ax.set_xlabel("Education Level")
ax.set_ylabel("Average Salary ($)")
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
for bar, val in zip(bars, avg_by_edu.values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 500,
            f"${val/1000:.1f}K", ha="center", va="bottom", fontsize=9, fontweight="bold")
ax.grid(True, alpha=0.3, axis="y")

plt.tight_layout()
plt.savefig("results.png", dpi=150, bbox_inches="tight")
plt.show()
print("\n📊 Plot saved as results.png")

# ─────────────────────────────────────────────────────────────
# 6. PREDICT ON NEW INPUT
# ─────────────────────────────────────────────────────────────
print("\n" + "="*45)
print("        SAMPLE PREDICTIONS")
print("="*45)

samples = pd.DataFrame([
    {"experience_years": 2,  "education": "Bachelor's", "job_role": "Data Analyst"},
    {"experience_years": 5,  "education": "Master's",   "job_role": "Software Engineer"},
    {"experience_years": 10, "education": "PhD",        "job_role": "ML Engineer"},
])

samples_enc = samples.copy()
samples_enc["education"] = le_edu.transform(samples["education"])
samples_enc["job_role"]  = le_role.transform(samples["job_role"])

preds = lr.predict(samples_enc)
for i, (_, row) in enumerate(samples.iterrows()):
    print(f"\n  👤 {row['job_role']} | {row['education']} | {row['experience_years']} yrs exp")
    print(f"     Predicted Salary: ${preds[i]:,.0f}")