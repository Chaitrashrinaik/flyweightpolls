from django.db.models import F
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Question, Choice, Tags
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

# Example view to handle GET requests
def get_request_example(request):
    print(request.GET)
    data = {}
    return render(request, 'template_name.html', data)

# View for listing polls with their choices and tags
@csrf_exempt
def polls_controller(request):
    logger.info("Received request to polls_controller")
    try:
        if request.method == "GET":
            polls = Question.objects.prefetch_related('choice_set', 'tags')
            data = []
            for poll in polls:
                choices = {}
                for choice in poll.choice_set.all():
                    choices[choice.choice_text] = choice.votes
                # Fetch tags as a list of tag names
                tag_names = list(poll.tags.values_list('tag_name', flat=True))
                poll_data = {
                    'Question': poll.question_text,
                    'QuestionID': poll.id,
                    'Tags': tag_names,
                    'OptionVote': choices
                }
                data.append(poll_data)
            json_response = JsonResponse({
                'msg': 'Fetched polls successfully',
                'data': data,
                'success': True
            }, safe=False)
            return json_response

        elif request.method == "POST":
            request_body = request.body.decode('utf-8')
            request_data = json.loads(request_body)
            logger.info("Received request body: %s", request_body)

            question_text = request_data.get("Question")
            option_vote = request_data.get("OptionVote")
            tag_names = request_data.get("Tags")

            question = Question.objects.create(
                question_text=question_text,
                pub_date=datetime.now()
            )

            for tag_name in tag_names:
                tag, created = Tags.objects.get_or_create(tag_name=tag_name)
                question.tags.add(tag)

            for choice_text, votes in option_vote.items():
                Choice.objects.create(question=question, choice_text=choice_text, votes=votes)

            response_data = {"msg": "Poll created successfully.", "success": True}
            return JsonResponse(response_data)

    except json.JSONDecodeError:
        logger.error("Invalid JSON data")
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.error(f"Error: {e}")
        return JsonResponse({"error": str(e)}, status=500)

# Example view to handle invalid request method
def goat_footballer(request):
    return JsonResponse({"error": "Invalid request method"}, status=405)

# View for filtering polls based on tags
def get_filter_polls(request):
    try:
        # Get the 'tags' parameter from the query string
        tags_str = request.GET.get('tags', '')
        tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]

        # Filter the polls based on the 'tags' parameter if provided
        if tags:
            filtered_polls = Question.objects.filter(tags__tag_name__in=tags).distinct().prefetch_related('choice_set', 'tags')
        else:
            filtered_polls = Question.objects.all().prefetch_related('choice_set', 'tags')

        data = []
        for poll in filtered_polls:
            choices = {choice.choice_text: choice.votes for choice in poll.choice_set.all()}

            poll_data = {
                'Question': poll.question_text,
                'QuestionID': poll.id,
                'Tags': [tag.tag_name for tag in poll.tags.all()],
                'OptionVote': choices
            }
            data.append(poll_data)

        response_data = {
            'msg': 'Fetched polls successfully',
            'data': data,
            'success': True
        }

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        logger.error(f"Error: {e}")
        return JsonResponse({'error': str(e)}, status=400)

# View for incrementing vote on a poll choice
@csrf_exempt
@require_http_methods(["PUT"])
def increment_poll_vote(request, question_id):
    logger.info("Received request to increment_poll_vote")
    try:
        # Get the Question object
        question = get_object_or_404(Question, pk=question_id)

        # Get the request body
        request_body = request.body.decode('utf-8')
        request_data = json.loads(request_body)
        logger.info("Received request body: %s", request_body)
        
        # Get the choice option to increment
        increment_option = request_data.get("incrementOption")

        # Get the Choice object for the specified option
        choice = question.choice_set.get(choice_text=increment_option)

        # Increment the vote count
        choice.votes = F("votes") + 1
        choice.save()

        # Fetch updated poll data
        updated_choices = {c.choice_text: c.votes for c in question.choice_set.all()}
        updated_poll_data = {
            'Question': question.question_text,
            'QuestionID': question.id,
            'Tags': [tag.tag_name for tag in question.tags.all()],
            'OptionVote': updated_choices
        }

        response_data = {
            "msg": "Poll updated successfully", 
            "success": True,
            "data": updated_poll_data
        }
        return JsonResponse(response_data)

    except Choice.DoesNotExist:
        response_data = {"msg": "Invalid choice option", "success": False}
        return JsonResponse(response_data, status=400)
    except json.JSONDecodeError:
        response_data = {"msg": "Invalid JSON data", "success": False}
        return JsonResponse(response_data, status=400)
    except Exception as e:
        response_data = {"msg": str(e), "success": False}
        return JsonResponse(response_data, status=500)

# View to get poll data by ID
def get_poll_data(request, question_id):
    logger.info("Received request to get_poll_data")
    try:
        if request.method == "GET":
            poll = Question.objects.filter(id=question_id).prefetch_related('choice_set', 'tags').first()
            if poll:
                choices = {choice.choice_text: choice.votes for choice in poll.choice_set.all()}
                poll_data = {
                    'Question': poll.question_text,
                    'QuestionID': poll.id,
                    'Tags': [tag.tag_name for tag in poll.tags.all()],
                    'OptionVote': choices
                }
                return JsonResponse({
                    'msg': 'Fetched poll successfully',
                    'data': poll_data,
                    'success': True
                }, safe=False)
            else:
                return JsonResponse({"error": "Poll not found"}, status=404)
        else:
            return JsonResponse({"error": "Invalid request method"}, status=405)
    except Exception as e:
        logger.error(f"Error in get_poll_data: {e}")
        return JsonResponse({"error": str(e)}, status=500)

# View to list all tags
def list_tags(request):
    try:
        # Get all unique tags from the Tags model
        tags = Tags.objects.values_list('tag_name', flat=True).distinct()
        return JsonResponse({
            "msg": "Fetched tags successfully",
            "data": list(tags),
            "success": True
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Updated view to handle fetching tags
def get_tags(request):
    if request.method == 'GET':
        tags = Tags.objects.values_list('tag_name', flat=True).distinct()
        return JsonResponse({'success': True, 'data': list(tags)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
