#!/bin/bash

# 下载并安装 Hugo Extended
HUGO_VERSION="0.123.7"
HUGO_BINARY="hugo_extended_${HUGO_VERSION}_linux-amd64"

echo "Downloading Hugo ${HUGO_VERSION}..."
wget -q "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}.tar.gz"

echo "Extracting Hugo..."
tar -xzf "${HUGO_BINARY}.tar.gz"

echo "Installing Hugo..."
chmod +x "${HUGO_BINARY}/hugo"
export PATH="$PWD/${HUGO_BINARY}:$PATH"

echo "Building site..."
./"${HUGO_BINARY}/hugo" --cleanDestinationDir
