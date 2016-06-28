#!/usr/bin/env python3

from sacred import Experiment
import json
import numpy as np
import time

ex = Experiment('hello_config')


@ex.capture
def some_function(x, b='different'):
    return 5 * x


@ex.automain
def my_main(message='hello', a=4):
    line_points = np.arange(100)
    line_data = a * line_points + np.random.rand(len(line_points)) * some_function(2)
    out = dict(message=message, line=dict(points=line_points.tolist(), data=line_data.tolist()))
    time.sleep(10)
    with open('output.json', 'w') as f:
        json.dump(out, f)
