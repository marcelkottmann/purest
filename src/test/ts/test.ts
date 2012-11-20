class Color {
    name: string;
}

class ProductVariant {
    label: string;
    colors: Color[];
}

class Product {
    label: string;
    description: string;
    variants: ProductVariant[];

    public getVariants(): ProductVariant[]
    {
        return this.variants;
    }
}

var blue = new Color();
blue.name = "blue";
var yellow= new Color();
yellow.name = "yellow";
var red= new Color();
red.name = "red";

var product = new Product();

product.label = "Demo Testprodukt";
product.description= "This product will make you happy. This product will make you happy. This product will make you happy. This product will make you happy.";
product.variants = new ProductVariant[];

var pv1 = new ProductVariant();
pv1.label = "Variante 1";

pv1.colors = new Color[];
pv1.colors.push(red);
pv1.colors.push(yellow);
pv1.colors.push(blue);

var pv2 = new ProductVariant();
pv2.label = "Variante 2";
pv2.colors = new Color[];
pv2.colors.push(yellow);

product.variants.push(pv1);
product.variants.push(pv2);


var directive = {
    '.label': product.label,
    '.description': product.description,
    'ul#outer li': {
        items: product.getVariants(),
        each: (item: ProductVariant){
            return {
                '.vLabel':item.label,
                'ul#inner li': {
                    items: item.colors,
                    each: (color: Color){
                        return {
                        'a':color.name,
                        'a@href+':color.name
                        };
                    }
                }
            }
        }
    }
}
