import os
import json
import sys
import io

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from ml.train_model import train_and_benchmark

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'model_artifacts')
REPORT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'evaluation_report.md')


def generate_evaluation_report():
    _, results = train_and_benchmark()

    benchmark_path = os.path.join(ARTIFACTS_DIR, "benchmark_results.json")
    with open(benchmark_path) as f:
        results = json.load(f)

    lines = [
        "# SkillGap AI — Model Evaluation Report\n",
        "## Model Comparison\n",
        "| Model | Accuracy | Precision | Recall | F1-Score |",
        "|---|---|---|---|---|",
    ]
    for r in results:
        lines.append(
            f"| {r['model']} | {r['accuracy']:.4f} | {r['precision']:.4f} | {r['recall']:.4f} | {r['f1_score']:.4f} |"
        )

    lines += [
        "\n## Deployed Model",
        "**Random Forest** is selected as the production model based on overall F1-score and ability to output calibrated class probabilities via `predict_proba`.",
        "\n## Dataset",
        "- 2,500 synthetic training rows across 4 roles",
        "- 80/20 stratified train-test split (random_state=42)",
        "- Labels generated via weighted-skill-coverage rule with Gaussian noise (sigma=0.05)",
        "- Threshold for positive fit label: weighted coverage >= 55%",
        "\n## Benchmark Notes",
        "- SVM (RBF kernel) performs competitively but lacks interpretability",
        "- Naive Bayes serves as the baseline; its independence assumption limits recall on correlated skill sets",
        "- Random Forest benefits from ensemble averaging, producing stable probability estimates used by the match gauge",
    ]

    report_content = "\n".join(lines)

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write(report_content)

    sys.stdout.buffer.write((report_content + f"\nReport saved to {REPORT_PATH}\n").encode('utf-8'))


if __name__ == "__main__":
    generate_evaluation_report()
