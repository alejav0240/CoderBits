from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('roles', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Personal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('numero', models.DecimalField(decimal_places=0, max_digits=20)),
                ('correo', models.EmailField(max_length=254, unique=True)),
                ('usuario', models.CharField(max_length=50, unique=True)),
                ('contrasena', models.CharField(max_length=255)),
                ('activo', models.BooleanField(default=True)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('rol', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='usuarios', to='roles.rol')),
            ],
        ),
    ]