#!/bin/sh
echo 'Installing server-side dependencies'
npm install
echo 'Installing client-side dependencies'
bower install
echo 'Setup done. You can start a local server by typing:'
echo '  gulp'
