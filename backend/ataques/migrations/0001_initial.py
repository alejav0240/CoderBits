from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ataque',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(max_length=100)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('ip_origen', models.CharField(blank=True, max_length=45, null=True)),
                ('ip_destino', models.CharField(blank=True, max_length=45, null=True)),
                ('puerto', models.IntegerField(blank=True, null=True)),
                ('fecha_detectado', models.DateTimeField(auto_now_add=True)),
                ('conteo_conexiones', models.IntegerField(blank=True, null=True)),
                ('activo', models.BooleanField(default=True)),
            ],
        ),
    ]
