from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'title', 'description', 'created_at', 'modified_at', 'attachment')
        read_only_fields = ('id', 'created_at', 'modified_at', 'user')