export class Order
{
  public Customer:Customer = new Customer;
  public orderNum:string="";
  public quantity:number=0;
  public price:string="";
  Total: string="";
}

export class Customer
{
  public FirstName:string="";
  public LastName:string="";
}

export interface ProductData {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

