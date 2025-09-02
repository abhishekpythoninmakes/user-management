from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'modified_at')
    list_filter = ('created_at', 'modified_at')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('created_at', 'modified_at')