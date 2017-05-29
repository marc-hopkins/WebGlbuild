// JavaScript source code
var nssofttech = {
    rwr: {
    },
    main: function () {
        console.clear();
        console.info("Main initialized from Tablerow script")
        var t = document.getElementsByTagName("table")[0]
        t.addEventListener("click", nssofttech.expndclps);

    },
    expndclps: function (e) {
        console.log("expndclps initialized from Tablerow script")
        var Oelm = e.target.parentElement;
        if (Oelm.hasAttribute("data-head")) {
            console.log("Element CLicked %o", Oelm)
            var exclass = document.getElementsByClassName('expand');
            var i = 0; l = exclass.length,
            flag = ((Oelm.getAttribute("data-head")) == "C") ? false : true;
            console.log("Flag is   %s", flag)
                 
            for (i = 0; i < l; i++) {
                exclass[0].classList.remove('expand');
            }
            var clean = document.querySelectorAll("tr[data-head]");
            i = 0; l = clean.length;
            for (i; i < l; i++) {
                clean[i].setAttribute("data-head", "R");
            }
            if (flag) {
                var mtbl = document.getElementsByTagName("table")[0], rowHeads = mtbl.rows.length, mtchrow = Oelm.rowIndex + 1;


                console.log("Table rows total %s", mtbl.rows.length);
                rowHeads = mtbl.rows.length;
                console.log("Row header selected : %i :: total rows %i", mtchrow, rowHeads)
                for (mtchrow; mtchrow < rowHeads; mtchrow++) {
                    if (mtbl.rows[mtchrow].getAttribute('data-head')) {
                        break;
                    }

                    mtbl.rows[mtchrow].classList.add('expand')
              }

                console.log(rowHeads);

                Oelm.setAttribute("data-head", "C")
            }
        }
    },
    getkeyrows: function () {

    },
    rwrprimer: (function () {
        //Primer for page
        document.addEventListener('readystatechange', function () {
            var drs = document.readyState;
            if (drs == "complete") {
                console.info("Document readyState is %s", drs);
                nssofttech.main();
            };

        })
    }()),
}