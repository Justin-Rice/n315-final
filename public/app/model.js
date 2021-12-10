var MODEL = (function(){
    var _changePage = function(pageName, callback){
        $.get(`pages/${pageName}/${pageName}.html`, function(data){
            //console.log(data)
            $("#app").html(data);
            if(callback){
              callback();
    
            }
        });
        
    }

        var _loadMakers = function(){
            $.getJSON("data/data.json", function(makers){
                $.each(makers._MAKERS, function(index, maker){
                    $(".makers").append(`
                    <div class="maker">
                    <img src="../img/${maker.makerImage}" />
                    <div class="name">${maker.makerName}</div>
                    <div class="price">$${maker.makerPrice}</div>
                    <div onclick="addToCart(${index})" class="buy">BUY NOW</div>
                  </div>

                    `)
                    console.log(index)

                });
            });

        }
    
    return {
        loadMakers : _loadMakers,
        changePage : _changePage,

    }
})();