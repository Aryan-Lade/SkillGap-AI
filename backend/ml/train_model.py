import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from ml.preprocessing import generate_synthetic_dataset, preprocess_dataset, PROCESSED_DIR, ROLES

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'model_artifacts')


def evaluate_model(model, X_test, y_test, name):
    y_pred = model.predict(X_test)
    return {
        "model": name,
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0), 4),
    }


def train_and_benchmark(force_regenerate=False):
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    training_path = os.path.join(PROCESSED_DIR, "training_data.csv")

    if force_regenerate or not os.path.exists(training_path):
        df = generate_synthetic_dataset(n_samples=8000)
        os.makedirs(PROCESSED_DIR, exist_ok=True)
        df.to_csv(training_path, index=False)
    else:
        df = pd.read_csv(training_path)
        if set(df["target_role"].unique()) != set(ROLES):
            print("Detected outdated roles in training_data.csv. Regenerating dataset for all roles...")
            df = generate_synthetic_dataset(n_samples=8000)
            df.to_csv(training_path, index=False)

    X, y, *_ = preprocess_dataset(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    rf_model.fit(X_train, y_train)

    svm_model = SVC(probability=True, kernel="rbf", C=1.0, gamma="scale", random_state=42)
    svm_model.fit(X_train, y_train)

    nb_model = GaussianNB()
    nb_model.fit(X_train, y_train)

    results = [
        evaluate_model(rf_model, X_test, y_test, "Random Forest"),
        evaluate_model(svm_model, X_test, y_test, "SVM"),
        evaluate_model(nb_model, X_test, y_test, "Naive Bayes"),
    ]

    joblib.dump(rf_model, os.path.join(ARTIFACTS_DIR, "random_forest_model.pkl"))

    benchmark_path = os.path.join(ARTIFACTS_DIR, "benchmark_results.json")
    with open(benchmark_path, "w") as f:
        json.dump(results, f, indent=2)

    print("\nBenchmark Results:")
    for r in results:
        print(f"  {r['model']:20s} | Acc: {r['accuracy']:.4f} | P: {r['precision']:.4f} | R: {r['recall']:.4f} | F1: {r['f1_score']:.4f}")

    print(f"\nModel artifacts saved to {ARTIFACTS_DIR}")
    return rf_model, results


if __name__ == "__main__":
    train_and_benchmark()
