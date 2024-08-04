from django.urls import path
from . import views

app_name = "polls"
urlpatterns = [
    path("", views.polls_controller, name="get_views"),
    path('<int:question_id>/', views.increment_poll_vote, name='increment_poll_vote'),
    path('polls/<int:question_id>/', views.get_poll_data, name='get_poll_data'),
    path('tags/', views.list_tags, name='list_tags'),  # Merged with 'api/tags/' to avoid duplication
     path('tags/', views.get_tags, name='get_tags'),
    path('polls/api/polls/', views.polls_controller, name='polls_controller'), # Removed redundant 'polls' part
    path('polls/filter/', views.get_filter_polls, name='filter_polls'),  # Updated path for filter polls
]
