from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Conexion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hora', models.DateTimeField()),
                ('ip_src', models.CharField(max_length=45)),
                ('ip_dst', models.CharField(max_length=45)),
                ('port_dst', models.IntegerField()),
                ('etiqueta', models.CharField(max_length=50)),
                ('protocolo', models.CharField(max_length=50)),
            ],
        ),
    ]