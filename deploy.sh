#!/usr/bin/env bash
yarn docs:build
git subtree push --prefix docs/.vuepress/dist web gh-pages
