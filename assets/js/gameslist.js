export {GamesList};

const CARD_HEIGHT = 160;

const BUTTON_CLASS = ['is-primary', 'is-success', 'is-warning', 'is-error'];

/*
* Classe per la gestione visuale della lista delle 
* sessioni di gioco disponibili
*/

class GamesList {
    constructor(device_height) {
        this.setCardPerPage(device_height);
        this.setCurrentPageNumber(0);
    }

    setCardPerPage(device_height) {
        this.cards_per_page = ~~((device_height - 190) / CARD_HEIGHT);
    }

    setList(list) {
        this.list = list;
        this.number_of_pages = ~~(this.list.length / this.cards_per_page + 
                                    (this.list.length % this.cards_per_page === 0 ? 0 : 1));
        if(this.number_of_pages < 1)
            this.number_of_pages = 1;
        
        this.setCurrentPageNumber(this.current_page_number);
    }

    setCurrentPageNumber(n_page) {
        if(n_page < 0)
            this.current_page_number = 0;
        else if(n_page >= this.number_of_pages)
            this.current_page_number = this.number_of_pages - 1;
        else
            this.current_page_number = n_page;
    }

    nextPageDoesNotExist() {
        return (this.current_page_number === this.number_of_pages - 1);
    }

    previousPageDoesNotExist() {
        return (this.current_page_number === 0);
    }

    setNextPage() {
        this.setCurrentPageNumber(this.current_page_number + 1);
        return !this.nextPageDoesNotExist();
    }

    setPreviousPage() {
        this.setCurrentPageNumber(this.current_page_number - 1);
        return !this.previousPageDoesNotExist();
    }

    textToPrint() {
        let content = '';
        if(this.list.length != 0) {
            for(let i = this.current_page_number * this.cards_per_page; i < this.current_page_number * this.cards_per_page + this.cards_per_page && i < this.list.length; i++) {
                
                content += '<div class="nes-container is-rounded is-dark game_card">' +
                                '<div>' +
                                    '<button id="game'+i+'" type="button" class="nes-btn ' + BUTTON_CLASS[i % BUTTON_CLASS.length] + ' active"><h1>►</h1></button>' +
                                    '<span class="nes-text is-disabled">' +
                                        '<table>' +
                                            '<tr>' +
                                                '<td>#' + this.list[i].game_number + '</td>' +
                                                '</tr>' +
                                            '<tr class="n_players">' +
                                                '<td>' + this.list[i].length + '/4</td>' +
                                            '</tr>' +
                                        '</table>' +
                                    '</span>'+
                                '</div>'+
                            '</div>';
            }
        } else {
            content += '<div class="nes-container is-rounded is-dark game_card">Nothing to show</div>';
        }
        return content;
    }
}