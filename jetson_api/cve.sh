#!/usr/bin/env bash

curl https://raw.githubusercontent.com/aquasecurity/trivy/master/contrib/install.sh | sh && \

    ./bin/trivy fs -s CRITICAL --exit-code 1 / && \

    ./bin/trivy fs -s HIGH / && \

    ./bin/trivy image --reset && \

    rm ./bin/trivy
