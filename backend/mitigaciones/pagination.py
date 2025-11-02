from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 9  # Valor por defecto
    page_size_query_param = 'limit'  # <- este es el parámetro que enviarás desde React
    max_page_size = 100
