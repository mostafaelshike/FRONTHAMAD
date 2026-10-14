import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../core/models/models';

@Component({
  selector: 'app-details-product',
  standalone: false,
  templateUrl: './details-product.html',
  styleUrl: './details-product.css',
})
export class DetailsProduct implements OnInit {
  product: any = {
    _id: '',
    name: 'جهاز قياس ضغط الدم الرقمي الأوتوماتيكي المعتمد',
    sku: 'OMR-M3-BP',
    brand: 'Omron Healthcare',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&q=80',
    price: 185,
    oldPrice: 230,
    discount: '20%',
    rating: 4.9,
    reviews: 49,
    stock: 'متوفر في المخزن الطبي',
    delivery: 'شحن سريع خلال 24-48 ساعة',
    description: 'جهاز تشخيصي معتمد لقياس ضغط الدم ومعدل ضربات القلب بدقة وسهولة مع كشف عدم انتظام ضربات القلب.'
  };

  gallery: string[] = [
    'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80'
  ];

  selectedImage: string = this.gallery[0];
  relatedProducts: Product[] = [];
  quantity: number = 1;
  loading: boolean = false;

  advantages = [
    { icon: 'bi-patch-check', title: 'ضمان معتمد', text: 'ضمان سنتين شامل الوكيل المعتمد', description: 'ضمان سنتين شامل الوكيل المعتمد' },
    { icon: 'bi-truck', title: 'توصيل فوري', text: 'شحن آمن لجميع المدن خلال 24-48 ساعة', description: 'شحن آمن لجميع المدن خلال 24-48 ساعة' },
    { icon: 'bi-shield-check', title: 'معتمد SFDA', text: 'مطابق للمواصفات واللوائح الطبية', description: 'مطابق للمواصفات واللوائح الطبية' }
  ];

  features = [
    { icon: 'bi-patch-check', title: 'تقنية Intelli Wrap 360°', description: 'قياس دقيق في أي وضعية حول الذراع بالكامل' },
    { icon: 'bi-heart-pulse', title: 'كشف اضطراب نظم القلب', description: 'تنبيه فوري عند رصد أي عدم انتظام في النبض' },
    { icon: 'bi-database', title: 'ذاكرة لمستخدمين اثنين', description: 'تخزين حتى 60 قراءة لكل مستخدم مع التاريخ والوقت' },
    { icon: 'bi-shield-check', title: 'معتمد طبياً وسريرياً', description: 'مطابق للمواصفات الدولية وهيئة الغذاء والدواء SFDA' }
  ];

  reviewSummary = {
    rating: 4.9,
    total: 48,
    percentages: [
      { stars: 5, percentage: 85, count: 40 },
      { stars: 4, percentage: 10, count: 5 },
      { stars: 3, percentage: 3, count: 2 },
      { stars: 2, percentage: 2, count: 1 },
      { stars: 1, percentage: 0, count: 0 }
    ]
  };

  reviews = [
    {
      name: 'د. خالد السبيعي',
      author: 'د. خالد السبيعي',
      initials: 'خ.س',
      date: 'منذ أسبوع',
      rating: 5,
      text: 'جهاز عالي الدقة وسهل الاستخدام، التغليف والتوصيل كان ممتازاً وسريعاً.',
      comment: 'جهاز عالي الدقة وسهل الاستخدام، التغليف والتوصيل كان ممتازاً وسريعاً.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'
    },
    {
      name: 'مجمع الأمل الطبي',
      author: 'مجمع الأمل الطبي',
      initials: 'أ.م',
      date: 'منذ أسبوعين',
      rating: 5,
      text: 'منتج أصلي مطابق لمواصفات هيئة الغذاء والدواء مع شهادة الضمان.',
      comment: 'منتج أصلي مطابق لمواصفات هيئة الغذاء والدواء مع شهادة الضمان.',
      avatar: 'https://images.unsplash.com/photo-1594824813583-050212f451f2?auto=format&fit=crop&w=120&q=80'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      } else {
        this.productService.getProducts({ limit: 1 }).subscribe({
          next: (res) => {
            if (res.success && res.data?.length > 0) {
              this.loadProduct(res.data[0]._id);
            }
          }
        });
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          const p = res.data;
          this.product = {
            ...p,
            brand: p.brandName || (typeof p.brand === 'object' ? p.brand?.name : p.brand) || 'علامة تجارية معتمدة',
            discount: p.badgePrice || (p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) + '%' : ''),
            stock: (p.stock || 0) > 0 ? `متوفر في المخزن (${p.stock} وحدة)` : 'نفد من المخزون',
            delivery: 'شحن سريع ومجاني للطلبات فوق 500 ر.س',
            reviews: p.reviewsCount || 34,
            rating: p.rating || 5
          };
          this.selectedImage = p.image;
          this.gallery = p.images && p.images.length > 0
            ? p.images.map((img: any) => typeof img === 'string' ? img : img.url)
            : [p.image];

          if (res.related) {
            this.relatedProducts = res.related;
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching product details:', err);
      }
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: (res) => {
        this.toastService.show(
          res.localOnly
            ? 'تمت الإضافة محليًا، لكن تعذرت مزامنة السلة مع الحساب'
            : `تمت إضافة (${this.quantity}) من "${this.product?.name}" إلى السلة`,
          res.localOnly ? 'info' : 'success'
        );
      },
      error: () => {
        this.toastService.show('تعذر إضافة المنتج إلى السلة، حاول مرة أخرى', 'error');
      }
    });
  }

  toggleFavorite(): void {
    if (!this.product) return;
    this.wishlistService.toggleWishlist(this.product).subscribe({
      next: (res) => {
        this.toastService.show(res.isAdded ? 'تمت إضافة المنتج إلى المفضلة' : 'تمت إزالة المنتج من المفضلة');
      },
      error: () => {
        this.toastService.show('تعذر تحديث المفضلة، حاول مرة أخرى', 'error');
      }
    });
  }

  isFav(): boolean {
    if (!this.product) return false;
    return this.wishlistService.isFavorite(this.product._id || this.product.id || '');
  }
}