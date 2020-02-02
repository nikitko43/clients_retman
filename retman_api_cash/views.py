from django.shortcuts import render
from rest_framework.views import APIView
from django.views.generic import ListView
from rest_framework import status
from rest_framework.response import Response
import os

module_dir = os.path.dirname(__file__) 
cash = os.path.join(module_dir, 'cash')

class Cash(APIView):
    def post(self, request):
        make_action = request.POST['action']
        try:
            amount = int(make_action[1:])
        except:
            return Response('Invalid amount', status=status.HTTP_400_BAD_REQUEST)

        if make_action.startswith('+'):
            self.make_action('add', amount, make_action)
        elif make_action.startswith('-'):
            self.make_action('sub', amount, make_action)
        elif make_action.startswith('='):
            self.make_action('set', amount, make_action)
        else:
            return Response('Invalid action', status=status.HTTP_400_BAD_REQUEST)

        return Response('OK', status=status.HTTP_200_OK)

    def get(self, request):
        with open(cash, 'r') as file:
            lines = file.readlines()

        return Response({'actions': lines[:20]})

    def make_action(self, action, amount, string):
        with open(cash, 'r') as file:
            lines = file.readlines()

        total = int(lines[0])

        if action == 'add':
            total += amount
        elif action == 'sub':
            total -= amount
        elif action == 'set':
            total = amount

        lines[0] = str(total)
        lines.insert(1, string)

        with open(cash, 'w') as file:
            for line in lines:
                file.write(line.strip() + '\n')
