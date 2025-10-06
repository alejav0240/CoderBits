from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ataques', '0001_initial'),
        ('personales', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mitigacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.TextField(blank=True, null=True)),
                ('detalle', models.TextField(blank=True, null=True)),
                ('activo', models.BooleanField(default=True)),
                ('fecha_mitigacion', models.DateTimeField(auto_now_add=True)),
                ('resultado', models.CharField(blank=True, max_length=100, null=True)),
                ('ataque', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mitigaciones', to='ataques.ataque')),
                ('ejecutado_por', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='personales.personal')),
            ],
        ),
    ]
