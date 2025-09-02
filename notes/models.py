from django.db import models
from users.models import User


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    attachment = models.FileField(upload_to='notes/attachments/', null=True, blank=True)

    def __str__(self):
        return self.title