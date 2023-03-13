const logo = document.querySelector("h1");
const searchBox = document.querySelector(".search-box");
const search = searchBox.querySelector("#search");

let query = "";
let page = 1;

logo.addEventListener("click", e => {
    location.reload();
});

searchBox.addEventListener("submit", e => {
    e.preventDefault();
    $(".result-container").empty();
    query = search.value;
    search.value = "";
    searchBook(query, page);
});

function searchBook(query, page) {
    if (query !== "") {
        $.ajax({
            "url": `https://dapi.kakao.com/v3/search/book?query=${query}&page=${page}&size=10&target=title`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "KakaoAK 4d16de5615a2664a8ad58468da4bfffa"
            }
        })
            .done(res => {
                res.documents.forEach(book => {
                    const url = book.url;
                    const thumbnail = book.thumbnail;
                    const title = book.title;
                    const author = book.authors[0];
                    const publisher = book.publisher;
                    const price = book.price;
                    const salePrice = book.sale_price;
                    const status = book.status;

                    if (status === "정상판매" && thumbnail !== "") { 
                        $(".result-container").append(`
                        <div class="book-card">
                        <a href="${url}" target="_blank">
                        <img src="${thumbnail}">
                        <h4>${title}</h4>
                        </a>
                        <p><span>${author}</span> | <span>${publisher}</span></p>
                        <p><span>${price}원</span>→ <span>${salePrice !== -1 ? salePrice : price}원</span></p>
                        </div>
                        `);
                    }
                });

                if(res.meta.is_end === false) {
                    searchBook(query, ++ page);
                }
            });
    }
}

