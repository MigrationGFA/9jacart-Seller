import {
  Star,
  MapPin,
  CheckCircle,
  Heart,
  Eye,
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import ProductCard from "./ProductCard";

// --- Mock Data ---
const products = [
  {
    id: 1,
    name: "The north coat",
    price: 260,
    originalPrice: 360,
    rating: 5,
    reviews: 65,
    image: "https://m.media-amazon.com/images/I/51+u7l9-wPL._AC_UY1000_.jpg", // Placeholder for Red Coat
    isNew: false,
    colors: [],
  },
  {
    id: 2,
    name: "Gucci duffle bag",
    price: 960,
    originalPrice: 1160,
    rating: 4.5,
    reviews: 65,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Gucci_Duffle_Bag.jpg/800px-Gucci_Duffle_Bag.jpg", // Placeholder for Bag
    isNew: false,
    colors: [],
  },
  {
    id: 3,
    name: "RGB liquid CPU Cooler",
    price: 160,
    originalPrice: 170,
    rating: 4.5,
    reviews: 65,
    image: "https://m.media-amazon.com/images/I/61X-wB-w+IL.jpg", // Placeholder Cooler
    isNew: false,
    colors: [],
  },
  {
    id: 4,
    name: "Small BookSelf",
    price: 360,
    originalPrice: null,
    rating: 5,
    reviews: 65,
    image: "https://m.media-amazon.com/images/I/71Y-1X-1+IL.jpg", // Placeholder Bookshelf
    isNew: false,
    colors: [],
  },
  {
    id: 5,
    name: "Breed Dry Dog Food",
    price: 100,
    originalPrice: null,
    rating: 3,
    reviews: 35,
    image: "https://m.media-amazon.com/images/I/81+X-X-X+IL.jpg", // Placeholder Dog Food
    isNew: false,
    colors: [],
  },
  {
    id: 6,
    name: "CANON EOS DSLR Camera",
    price: 360,
    originalPrice: null,
    rating: 4,
    reviews: 95,
    image: "https://m.media-amazon.com/images/I/71EWRyqzw0L.jpg", // Placeholder Camera
    isNew: false,
    colors: [],
  },
  {
    id: 7,
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    originalPrice: null,
    rating: 5,
    reviews: 325,
    image: "https://m.media-amazon.com/images/I/71+X-X-X+IL.jpg", // Placeholder Laptop
    isNew: false,
    colors: [],
  },
  {
    id: 8,
    name: "Curology Product Set",
    price: 500,
    originalPrice: null,
    rating: 4,
    reviews: 145,
    image: "https://m.media-amazon.com/images/I/61+X-X-X+IL.jpg", // Placeholder Skincare
    isNew: false,
    colors: [],
  },
  {
    id: 9,
    name: "Kids Electric Car",
    price: 960,
    originalPrice: null,
    rating: 5,
    reviews: 65,
    image: "https://m.media-amazon.com/images/I/61+X-X-X+IL.jpg", // Placeholder Car
    isNew: true,
    colors: ["#ef4444", "#ef4444"], // Red swatches
  },
  {
    id: 10,
    name: "Jr. Zoom Soccer Cleats",
    price: 1160,
    originalPrice: null,
    rating: 5,
    reviews: 35,
    image: "https://m.media-amazon.com/images/I/71+X-X-X+IL.jpg", // Placeholder Cleats
    isNew: false,
    colors: ["#eab308", "#ef4444"], // Yellow, Red
  },
  {
    id: 11,
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    originalPrice: null,
    rating: 4.5,
    reviews: 55,
    image: "https://m.media-amazon.com/images/I/61+X-X-X+IL.jpg", // Placeholder Gamepad
    isNew: true,
    colors: ["#000000", "#ef4444"], // Black, Red
  },
  {
    id: 12,
    name: "Quilted Satin Jacket",
    price: 660,
    originalPrice: null,
    rating: 4.5,
    reviews: 55,
    image: "https://m.media-amazon.com/images/I/61+X-X-X+IL.jpg", // Placeholder Jacket
    isNew: false,
    colors: ["#1e293b", "#ef4444"], // Dark Blue, Red
  },
];


const PromoBanner = () => {
  return (
    <div className="bg-black rounded-sm p-10 md:p-14 my-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px]">
      <div className="z-10 text-white space-y-8 max-w-lg">
        <span className="text-[#00FF66] font-semibold text-sm">Categories</span>
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
          Enhance Your <br /> Music Experience
        </h2>

        {/* Countdown */}
        <div className="flex gap-4">
          {[
            { val: 23, label: "Hours" },
            { val: 5, label: "Days" }, // Adjusted order to match generic layouts or keep strictly as image
            { val: 59, label: "Mins" },
            { val: 35, label: "Secs" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white text-black rounded-full w-16 h-16 flex flex-col items-center justify-center"
            >
              <span className="font-bold text-sm leading-none">{item.val}</span>
              <span className="text-[10px] leading-none mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button className="bg-[#00FF66] text-white px-8 py-3 rounded-sm font-medium hover:bg-[#00cc52] transition-colors">
          Buy Now!
        </button>
      </div>

      {/* Decorative Blur Effect behind image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Image */}
      <div className="relative z-10 mt-8 md:mt-0 max-w-lg">
        {/* Placeholder for Speaker Image */}
        <img
          src="https://pngimg.com/d/jbl_speaker_PNG31.png"
          alt="JBL Speaker"
          className="w-full drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

const StorefrontPage = () => {
  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* --- Container --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                alt="Vendor Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold text-[#182F38]">
                La Porsh Footies
              </h1>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="font-bold">5.0</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">144 Reviews</span>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1 text-[#00FF66]">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          <button className="bg-[#1E4700] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#163600] transition-colors self-start md:self-center">
            Contact Vendor
          </button>
        </header>

        {/* 2. Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium text-[#182F38]">
              Products <span className="text-gray-400 text-base">(23)</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <button className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded text-sm min-w-[140px] text-gray-700">
              Electronics <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Search Input */}
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1E4700]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4" />
              Sort by
            </button>
          </div>
        </div>

        {/* 3. Product Grid (First 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-10">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 4. Promo Banner */}
        <PromoBanner />

        {/* 5. Product Grid (Remaining) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-14">
          {products.slice(4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 6. Pagination */}
        <div className="flex justify-center md:justify-end">
          <div className="flex gap-2">
            {/* Previous */}
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* Numbers */}
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1E4700] text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-600">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-600">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-end text-gray-400 tracking-widest">
              ...
            </span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-600">
              12
            </button>

            {/* Next */}
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorefrontPage;

// export default function StorefrontPage() {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Storefront</h1>
//           <p className="text-muted-foreground">
//             Customize your public store appearance
//           </p>
//         </div>
//       </div>

//       {/* Coming Soon Content */}
//       <div className="flex flex-col items-center justify-center py-20">
//         <div className="text-center max-w-md">
//           <div className="text-8xl mb-6">🏪</div>
//           <h2 className="text-2xl font-bold text-foreground mb-4">
//             Storefront Builder Coming Soon
//           </h2>
//           <p className="text-muted-foreground mb-6 leading-relaxed">
//             We're creating a powerful storefront customization tool where you'll be able to:
//           </p>
//           <div className="text-left space-y-2 mb-8">
//             <div className="flex items-center space-x-3">
//               <span className="text-primary">✓</span>
//               <span className="text-sm text-muted-foreground">Design your custom store layout</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-primary">✓</span>
//               <span className="text-sm text-muted-foreground">Upload logos and banner images</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-primary">✓</span>
//               <span className="text-sm text-muted-foreground">Choose from multiple themes</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-primary">✓</span>
//               <span className="text-sm text-muted-foreground">Customize colors and fonts</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-primary">✓</span>
//               <span className="text-sm text-muted-foreground">Preview changes in real-time</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-primary">✓</span>
//               <span className="text-sm text-muted-foreground">Mobile-responsive design</span>
//             </div>
//           </div>
//           <div className="bg-card border border-border rounded-lg p-4">
//             <p className="text-sm text-muted-foreground">
//               <strong className="text-foreground">Note:</strong> Your products are already available through the main marketplace. This feature will give you a dedicated storefront.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
