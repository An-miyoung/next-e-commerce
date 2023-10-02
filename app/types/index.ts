export interface MenuItems {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ForgetPassword {
  email: string;
}

export interface UpdatePassword {
  password: string;
  token: string;
  userId: string;
}

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  verified: boolean;
}

export interface NewProductInfo {
  title: string;
  description: string;
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
  images?: File[];
  thumbnail?: File;
}

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
  price: {
    base: number;
    discounted: number;
  };
  quantity: number;
  category: string;
}

export interface ProductToUpdate {
  title: string;
  description: string;
  bulletPoints: string[];
  category: string;
  quantity: number;
  price: {
    base: number;
    discounted: number;
  };
  thumbnail?: { url: string; id: string };
  images?: { url: string; id: string }[];
}

export interface NewCartRequest {
  productId: string;
  quantity: number;
}

export interface NewFeaturedProduct {
  banner: { url: string; id: string };
  title: string;
  link: string;
  linkTitle: string;
}

export interface FeaturedProductForUpdate {
  banner?: { url: string; id: string };
  title: string;
  link: string;
  linkTitle: string;
}

export interface UserProfileToUpdate {
  id: string;
  avatar?: { url: string; id: string };
  name: string;
}

export interface CartProduct {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  totalPrice: number;
  quantity: number;
}

export interface CartItems {
  products: CartProduct[];
  id: string;
  totalQty: number;
  totalPrice: number;
}

export interface StripeCustomer {
  metadata: {
    userId: string;
    cartId: string;
    type: "checkout" | "instant-checkout";
    product: string;
  };
}

export type product = {
  id: string;
  title: string;
  thumbnail: string;
  totalPrice: number;
  price: number;
  quantity: number;
};

export interface Orders {
  id: any;
  products: product[];
  paymentStatus: string;
  date: string;
  total: number;
  deliveryStatus: "ordered" | "delivered" | "shipped";
}
