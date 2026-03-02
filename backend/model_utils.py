"""
Utilities for preprocessing keypoint sequences and postprocessing model outputs.
"""
import numpy as np
from typing import List

# Keypoints order as defined in the API contract
KEYPOINT_KEYS = [
    "nose", "left_shoulder", "right_shoulder",
    "left_elbow", "right_elbow",
    "left_wrist", "right_wrist",
    "left_hip", "right_hip",
    "left_knee", "right_knee",
    "left_ankle", "right_ankle",
]

# Fixed number of frames the model expects
NUM_FRAMES = 30
# 13 keypoints × 2 coordinates (x, y)
NUM_FEATURES = len(KEYPOINT_KEYS) * 2  # 26


def preprocess_keypoints(keypoint_sequence: List[dict]) -> np.ndarray:
    """
    Flatten and normalise a list of keypoint frames into a numpy array
    suitable for model input.

    Parameters
    ----------
    keypoint_sequence : list of dict
        Each dict maps keypoint name → [x, y] coordinates (values in [0, 1]).

    Returns
    -------
    np.ndarray of shape (1, NUM_FRAMES, NUM_FEATURES)
        Padded / truncated to exactly NUM_FRAMES frames, then expanded to
        include the batch dimension.
    """
    frames = []
    for frame in keypoint_sequence:
        flat = []
        for key in KEYPOINT_KEYS:
            coords = frame.get(key, [0.0, 0.0])
            flat.extend([float(coords[0]), float(coords[1])])
        frames.append(flat)

    # Truncate if longer than NUM_FRAMES
    frames = frames[:NUM_FRAMES]

    # Pad with zeros if shorter than NUM_FRAMES
    while len(frames) < NUM_FRAMES:
        frames.append([0.0] * NUM_FEATURES)

    arr = np.array(frames, dtype=np.float32)  # (NUM_FRAMES, NUM_FEATURES)
    return np.expand_dims(arr, axis=0)         # (1, NUM_FRAMES, NUM_FEATURES)


def postprocess_output(raw_output) -> float:
    """
    Convert raw model output to a 0-100 risk score.

    The model is expected to output a single sigmoid float in [0, 1].
    This function multiplies it by 100 and rounds to one decimal place.

    Parameters
    ----------
    raw_output : array-like
        Raw output from model.predict(), shape (1,) or (1, 1).

    Returns
    -------
    float
        Risk score in [0, 100].
    """
    value = float(np.squeeze(raw_output))
    # Clamp to [0, 1] in case the model output is slightly out of range
    value = max(0.0, min(1.0, value))
    return round(value * 100, 1)
