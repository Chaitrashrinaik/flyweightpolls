from django.db import models

class Tags(models.Model):
    tag_name = models.CharField(max_length=200)
    def __str__(self):
        return self.tag_name

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    tags = models.ManyToManyField(Tags, related_name='questions')
    def __str__(self):
        return self.question_text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    def __str__(self):
        return self.choice_text
