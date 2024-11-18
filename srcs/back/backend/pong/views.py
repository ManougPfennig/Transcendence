from django.shortcuts import render, HttpResponse
from django.http import JsonResponse


def createCustomGame(request):
	return JsonResponse("hello")