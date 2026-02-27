from django.shortcuts import render , get_object_or_404
from store.models import Product
from category.models import Category

# Create your views here.
def store(request , category_slug =None):
    categories = None 
    product = None 
    if category_slug != None:
        categories = get_object_or_404(Category , slug = category_slug )
        # print("categories :" , end = "")
        # print(categories)
        # print("category_slug :" , end = "")
        # print(category_slug)
        # print("category url :" , end = "")
        # print(categories.get_url())
        product = Product.objects.all().filter(category=categories ,is_available = True)
        product_count = product.count()
        context = {
            'products':product,
        }
    else:
        product = Product.objects.all().filter(is_available=True)
        context = {
            'products':product,
    }
    return render(request , 'store/store.html' ,context)

def product_detail(request, category_slug, product_slug):
    try:
        single_product = Product.objects.get(category__slug = category_slug , slug = product_slug )
    except Exception as e :
        raise e 
    context = {
        'single_product': single_product,
    }
    return render(request, 'store/product_detail.html', context)

# def product_detail(request, category_slug, product_slug):
#     return render(request, 'store/product_detail.html')
