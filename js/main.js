$(document).ready(function(){

    var _url = "https://my-json-server.typicode.com/erickirwansyah5/pwaapi/products"
    
    var dataResults = ""
    var catResults =""
    var categories =[]
    
    const renderPage = data => {
            $.each(data, function(key,items){
                dataResults += `
                <div>
                    <h3>${items.name}</h3>
                    <p>${items.category}</p>
                </div>
                `;
    
                if($.inArray(items.category, categories) == -1) {
                    categories.push(items.category);
                    catResults +=`<option value="${items.category}">${items.category}</option>`
                }
            })
            $('#products').html(dataResults);
            $('#cat-select').html(`<option value="all">semua</option>` + catResults);
    }
   

    var netoworkDatarev= false;
    
    var networkUpdate = fetch(_url).then(function(response){
        return response.json()
    }).then(data =>{
        netoworkDatarev = true;
        renderPage(data)
    })

    caches.match(_url).then(response=>{
        if(!response) throw Error("no data on cache")
        return response.json()
    }).then(data=> {
        if(!netoworkDatarev) {
            renderPage(data)
            console.log("render data from cache")
        }
    }).catch(()=> {
        return networkUpdate;
    })

    // fungsi filter
    $("#cat-select").on('change', function(){
        upateProduct($(this).val())
        // alert('ok')
    })

    function upateProduct(cat){
        var dataResults ="";
        var _newUrl = _url

        if(cat != 'all') {
            _newUrl = _url + "?category=" +cat
        }
        $.get(_newUrl, function(data){
            $.each(data, function(key,items){
                dataResults += `
                <div>
                    <h3>${items.name}</h3>
                    <p>${items.category}</p>
                </div>
                `;
            })
            $('#products').html(dataResults);
        })
    }
}) //end jquery 

// pwa
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }