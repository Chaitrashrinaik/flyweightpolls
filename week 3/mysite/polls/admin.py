from django.contrib import admin
from .models import Question, Choice, Tags

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'pub_date')  # Ensure question_text is an attribute of Question
    inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice)
admin.site.register(Tags)
