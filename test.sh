#!/bin/bash

set -e

(cd test && grunt && echo 'OK') || echo 'FAIL'
