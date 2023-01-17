import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  prevCategoryId: number = 1;

  currentCategoryName: string = "";
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(theKeyword).subscribe(data => {
      this.products = data;
    });
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      // get the "id" param string. Convert string to number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.prevCategoryId != this.currentCategoryId) {
      this.pageNumber = 1
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(data => {
      this.products = data;
      console.log(data);
      
    })
  }
}
