# Generated by Django 5.0.1 on 2024-05-30 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mail", "0002_alter_user_first_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="email",
            name="id",
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="user",
            name="id",
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
