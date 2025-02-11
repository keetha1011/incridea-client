type Sponsor = {
  name: string;
  title?: string;
  desc?: string;
  notCloudinary?: boolean;
  websiteURL: string;
  logo: string;
};

const SPONSORS: Sponsor[] = [
  {
    name: "Lotus Properties, Mangalore",
    title: "Sponsor",
    notCloudinary: true,
    desc: "Founded in 2015 with the blessings of Brahmashree K S Nithyananda, Lotus Properties is a leading real estate firm in Mangaluru. Guided by the philosophy of “We Pursue Quality,” it is committed to delivering high-quality residential and commercial projects. Led by industry veterans Jithendra Kottary and Sampath Kumar Shetty, who bring over 40 years of combined experience, the company has redefined the region’s real estate landscape.",
    websiteURL: "https://lotusproperties.co.in/",
    logo: "Lotus_Properties_Logo.jpg",
  },
  {
    name: "SL Shet Gold & Diamond House",
    title: "Core Title Sponsor ",
    desc: "For exquisite jewelry, S L Shet Gold & Diamond House in Mangalore has been a prominent name. With extensive experience in the gems and jewellery industry, this establishment has gained recognition for its stunning designs and collections.Renowned for its handpicked and exclusive designs showcased in its gold and diamond jewellery collections, the fine craftsmanship accentuates each precious piece.Catering to a wide range of tastes and is suitable for special occasions like weddings and ceremonies.",
    websiteURL: "",
    logo: "S_L_Shet_Logo.png",
  },
  {
    name: "Nandini",
    title: "Core Title Sponsor ",
    desc: "Indulge in the pure goodness of Nandini, your go-to destination for premium dairy products. With a legacy of excellence spanning decades, Nandini brings you the finest selection of milk, curd, ghee, and more, straight from the farm to your table.Their commitment to quality and freshness ensures every sip and bite is a delight.Elevate your culinary experience with Nandini ? the taste of tradition and purity.",
    websiteURL: "",
    logo: "Nandini.png",
  },
  {
    name: "Garodi steels",
    title: "Sponsor",
    desc: "From a single retail outlet near Garodi Temple, Mangalore to nine branches across five districts, this company has flourished into a family of over two hundred employees.Committed to delivering top- notch quality products in every segment, customers can trust in their dedication to excellence. With a vast network of over 200 dealers and ongoing interactions with engineers, contractors, fabricators, and customers, feedback is valued to ensure continuous improvement and customer satisfaction.Experience excellence with this reputable brand.",
    websiteURL: "",
    logo: "garodiSteel-logo.png",
  },
  {
    name: "Radha medicals",
    title: "Sponsor",
    desc: "Discover healthcare excellence at Radha Medicals, your trusted destination for all your medical needs.With a commitment to providing top- notch services and quality products, Radha Medicals ensures your well - being is their priority.From prescription medications to over - the - counter remedies, our knowledgeable staff is here to assist you every step of the way.Experience convenience and care with Radha Medicals, Mangalore- your partner in health.",
    websiteURL: "",
    logo: "download_6_1.png",
  },
  {
    name: "LIC",
    title: "Core Title Sponsor",
    notCloudinary: true,
    desc: "LIC, India's most trusted life insurance provider, has been a pillar of financial security for generations. With a legacy of trust and excellence, LIC offers a diverse range of insurance solutions, from life protection and retirement plans to child education and investment policies. Committed to safeguarding the financial future of millions, LIC ensures comprehensive coverage and long-term savings, making it the preferred choice for individuals and families across the nation.",
    websiteURL: "https://licindia.in/",
    logo: "LIC_Logo.jpg",
  },
];

export { SPONSORS };
export type { Sponsor };
