#!/usr/bin/env python3
import subprocess
import argparse
import os

parser = argparse.ArgumentParser(description='spawn and notify shell command result.')
parser.add_argument('command_line', type=str, help='command_line to execute')
parser.add_argument('arguments', metavar='arg', type=str, nargs='*',
                    help='command_line argument')

args = parser.parse_args()

command = [args.command_line]
command.extend(args.arguments)
command_str = ' '.join(command)

result = subprocess.run(command, stdout=subprocess.PIPE)

if result.returncode != 0:
    picture = os.getcwd() + '/icons/close.png'
else:
    picture = os.getcwd() + '/icons/tick.png'

subprocess.call(['notify-send','-i', picture, command_str, result.stdout])
