"""
Model loader for the football injury prediction Keras model.

Place your trained Keras model file at backend/model.h5 (or set the MODEL_PATH
environment variable).  When the file is absent the module falls back to a
deterministic mock prediction so that the rest of the API keeps working.
"""
import os
import logging
import random

import numpy as np

from model_utils import preprocess_keypoints, postprocess_output

logger = logging.getLogger(__name__)

# Path to the Keras model file.  Override with the MODEL_PATH env variable.
_MODEL_PATH = os.environ.get("MODEL_PATH", os.path.join(os.path.dirname(__file__), "model.h5"))

_model = None


def _load_model():
    """Attempt to load the Keras model once, cache the result."""
    global _model
    if _model is not None:
        return _model

    if not os.path.exists(_MODEL_PATH):
        logger.warning(
            "Model file not found at '%s'. Using mock prediction. "
            "Place your trained model.h5 file at that path to enable real inference.",
            _MODEL_PATH,
        )
        return None

    try:
        # Import TensorFlow lazily so the rest of the backend starts even when
        # TensorFlow is not installed (mock fallback will be used instead).
        from tensorflow.keras.models import load_model
        _model = load_model(_MODEL_PATH)
        logger.info("Keras model loaded successfully from '%s'.", _MODEL_PATH)
    except Exception as exc:
        logger.error("Failed to load model from '%s': %s. Falling back to mock prediction.", _MODEL_PATH, exc)
        _model = None

    return _model


def predict_risk(keypoint_sequence, player_stats=None):
    """
    Predict injury risk from a keypoint sequence and optional player stats.

    Parameters
    ----------
    keypoint_sequence : list of dict
        List of keypoint frames.  Each frame maps keypoint names to [x, y]
        coordinates.  See model_utils.KEYPOINT_KEYS for the expected keys.
    player_stats : dict, optional
        Optional player statistics (age, weight, height, minutes_played, …).
        Reserved for future use when the model supports additional inputs.

    Returns
    -------
    float
        Risk score in [0, 100].
    """
    model = _load_model()

    if model is None:
        # Mock fallback: return a deterministic-ish value based on the input
        # so repeated calls with the same data are consistent.
        logger.warning("Returning mock risk prediction.")
        seed = hash(str(keypoint_sequence))
        rng = random.Random(seed)
        return round(rng.uniform(0, 100), 1)

    # Preprocess the keypoint sequence into the expected input shape
    model_input = preprocess_keypoints(keypoint_sequence)  # (1, 30, 26)

    raw_output = model.predict(model_input, verbose=0)
    return postprocess_output(raw_output)
