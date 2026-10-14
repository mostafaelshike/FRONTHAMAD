import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';

import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { BrandService } from '../../../../core/services/brand.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';

import {
  Product,
  Category,
  Brand
} from '../../../../core/models/models';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productQueries = new Subject<void>();

  categories: Category[] = [];
  brands: Brand[] = [];
  products: Product[] = [];
  selectedProduct: Product | null = null;

  loading = false;
  requestError = '';

  selectedCategory = 'all';
  selectedBrand = 'all';
  searchKeyword = '';
  sortBy = 'latest';

  totalMatching = 0;
  currentPage = 1;
  readonly pageSize = 9;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productQueries.pipe(
      debounceTime(250),
      switchMap(() => {
        const params: Record<string, string | number> = {
          page: this.currentPage,
          limit: this.pageSize,
          sort: this.sortBy
        };
        if (this.selectedCategory !== 'all') params['category'] = this.selectedCategory;
        if (this.selectedBrand !== 'all') params['brand'] = this.selectedBrand;
        if (this.searchKeyword.trim()) params['keyword'] = this.searchKeyword.trim();

        this.loading = true;
        this.requestError = '';
        this.cdr.detectChanges();
        return this.productService.getProducts(params).pipe(
          catchError((error) => {
            console.error('Error fetching products:', error);
            this.requestError = error?.message || 'تعذر تحميل المنتجات، حاول مرة أخرى';
            this.products = [];
            this.totalMatching = 0;
            this.totalPages = 1;
            return EMPTY;
          }),
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      if (!res.success) {
        this.requestError = res.message || 'تعذر تحميل المنتجات، حاول مرة أخرى';
        this.products = [];
      } else {
        this.products = res.data || [];
      }
      this.totalMatching = res.total ?? res.count ?? this.products.length;
      this.totalPages = Math.max(1, res.totalPages ?? Math.ceil(this.totalMatching / this.pageSize));
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
        this.loadProducts();
      }
      this.cdr.detectChanges();
    });

    /* =========================
       CATEGORIES
    ========================= */

    this.categoryService.getCategories({ limit: 100 }).subscribe({
      next: (res) => {

        if (res.success && res.data) {
          this.categories = res.data;
        }

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error fetching categories:', err);
        this.cdr.detectChanges();
      }
    });


    /* =========================
       BRANDS
    ========================= */

    this.brandService.getBrands({ limit: 100 }).subscribe({
      next: (res) => {

        if (res.success && res.data) {
          this.brands = res.data;
        }

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error fetching brands:', err);
        this.cdr.detectChanges();
      }
    });


    /* =========================
       QUERY PARAMS
    ========================= */

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {

      this.selectedCategory = params['category'] || 'all';
      this.selectedBrand = params['brand'] || 'all';
      this.searchKeyword = params['keyword'] || '';
      this.currentPage = 1;

      this.loadProducts();
    });
  }


  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  loadProducts(): void {
    this.productQueries.next();
  }


  /* =====================================================
     CATEGORY
  ===================================================== */

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadProducts();
  }


  /* =====================================================
     BRAND
  ===================================================== */

  filterByBrand(brandId: string): void {
    this.selectedBrand = brandId;
    this.currentPage = 1;
    this.loadProducts();
  }


  /* =====================================================
     SORT
  ===================================================== */

  onSortChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.sortBy = select.value;
    this.currentPage = 1;
    this.loadProducts();
  }


  /* =====================================================
     SEARCH
  ===================================================== */

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage || this.loading) return;
    this.currentPage = page;
    this.loadProducts();
  }

  get visiblePages(): number[] {
    const first = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - 4));
    const last = Math.min(this.totalPages, first + 4);
    return Array.from({ length: last - first + 1 }, (_, index) => first + index);
  }

  resetFilters(): void {
    this.selectedCategory = 'all';
    this.selectedBrand = 'all';
    this.searchKeyword = '';
    this.currentPage = 1;
    this.loadProducts();
  }


  /* =====================================================
     CART
  ===================================================== */

  addToCart(
    product: Product,
    event?: Event
  ): void {

    event?.stopPropagation();

    this.cartService
      .addToCart(product, 1)
      .subscribe({

        next: (res) => {
          this.toastService.show(
            res.localOnly
              ? 'تمت الإضافة محليًا، لكن تعذرت مزامنة السلة مع الحساب'
              : `تمت إضافة "${product.name}" إلى سلة المشتريات`,
            res.localOnly ? 'info' : 'success'
          );
        },

        error: (err) => {

          console.error(
            'Error adding product to cart:',
            err
          );
          this.toastService.show('تعذر إضافة المنتج إلى السلة، حاول مرة أخرى', 'error');
        }
      });
  }


  /* =====================================================
     WISHLIST
  ===================================================== */

  toggleFavorite(
    product: Product,
    event?: Event
  ): void {

    event?.stopPropagation();

    this.wishlistService
      .toggleWishlist(product)
      .subscribe({

        next: (res) => {
          this.toastService.show(
            res.isAdded
              ? 'تمت إضافة المنتج إلى المفضلة'
              : 'تمت إزالة المنتج من المفضلة'
          );

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Error updating wishlist:',
            err
          );
          this.toastService.show('تعذر تحديث المفضلة، حاول مرة أخرى', 'error');
        }
      });
  }


  isFav(product: Product): boolean {
    return this.wishlistService.isFavorite(
      product._id ||
      product.id ||
      ''
    );
  }

  openProduct(product: Product): void {
    this.selectedProduct = product;
  }
}