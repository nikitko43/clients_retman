#!/bin/bash
cd /root/retman
gunicorn -b 127.0.0.1:8003 retman.wsgi:application &