//   konversi ke rupiah 
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};
  
document.addEventListener('alpine:init', () => {
    Alpine.data('product', () => ({
        items: [
            {
                id: 1,
                name: 'ZND Mono Boxy Hoodie - Onyx Black',
                img: '1.jpeg',
                price: 190000
            },
            {
                id: 2,
                name: 'ZND Mono Boxy Hoodie - Clean White',
                img: '2.jpeg',
                price: 190000
            },
            {
                id: 3,
                name: 'ZND Zip Core Hoodie - Shadow Black',
                img: '3.jpg',
                price: 200000
            },
            {
                id: 4,
                name: 'ZND Zip Core Hoodie - Cloud White',
                img: '4.jpg',
                price: 200000
            }
        ]
    }));

    Alpine.store('bag',{
        items: [], 
        total: 0,
        quantity: 0,
        add(newItem) {
            // cek apakah ada barang yang sama di bag
            const bagItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / bag masih kosong
            if(!bagItem) {
                this.items.push({...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika baarang sudah ada, cek apakah beda atau sama dengan yang ada di bag
                this.items = this.items.map((item) => {
                    // jika barangnya beda
                    if(item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            // ambil item yang mau diremove berdasarkan id nya
            const bagItem = this.items.find((item) => item.id === id);
            
            // jika item lebih dari 1
            if(bagItem.quantity > 1) {
            // telusuri satu satu
            this.items = this.items.map((item) => {
                // jika bukan barang yang di klik
                if(item.id !== id) {
                    return item;
                } else {
                    item.quantity--;
                    item.total = item.price * item.quantity
                    this.quantity--;
                    this.total -= item.price;
                    return item;
                }
            })
            } else if (bagItem.quantity === 1) {
                // jika barangnnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= bagItem.price;
            }
        }
    });
});

// form validation 
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
 for(let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].value.length !== 0){
        checkoutButton.classList.remove('disabled');
        checkoutButton.classList.add('disabled');
    } else {
        return false;
    }
 }
 checkoutButton.disabled = false
 checkoutButton.classList.remove('disabled');
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    const formData = new FormData (form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const massage = formatMassage(objData);
    window.open('https://wa.me/6289608681338?text=' + encodeURIComponent(massage));
});

// format pesan Whatsapp
const formatMassage = (obj) => {
    return `
Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No HP: ${obj.phone}
Size: ${obj.size}

Data Pesanan:
${JSON.parse(obj.items).map((item) =>
    `${item.name} (${item.quantity} x ${rupiah(item.price)}) = ${rupiah(item.total)}`
).join('\n')}

TOTAL: ${rupiah(obj.total)}

Terima kasih.
`;
};



