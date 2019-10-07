import {
    Component,
    OnInit
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import {DragAndDropService} from './drag-and-drop.service'

@Component({
    selector: 'app-drag-and-drop',
    templateUrl: './drag-and-drop.component.html',
    styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

    constructor(private dragAndDropS: DragAndDropService) {
        this.buildForm();
    }

    ngOnInit() {
    }

    public statusFileText: string = "Перетащите сюда файл или нажмите чтобы выбрать";
    public files: any;

    public frm = new FormGroup({});
    public maxFileSize: number = 1e+7;

    public tableHeader: string[];
  
  
    private buildForm() {
        this.frm = new FormGroup({
            file: new FormControl("", [Validators.required])
        });
    }

    uploadFile(event) {
        this.files = null;
        this.tableHeader = null;
        
        const validFile = this.validateUploadFile(event);
        
        if (validFile) {
            let arrayBuffer;
            let file = event[0];
            let fileReader = new FileReader();
            let parseFile = null;
            fileReader.onload = (e) => {
                arrayBuffer = fileReader.result;
                let data = new Uint8Array(arrayBuffer);
                let arr = new Array();
                for(let i = 0; i != data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                let bstr = arr.join("");
                let workbook = XLSX.read(bstr, {type:"binary"});
                let first_sheet_name = workbook.SheetNames[0];
                let worksheet = workbook.Sheets[first_sheet_name];
                parseFile = XLSX.utils.sheet_to_json(worksheet,{raw:true});
                this.dragAndDropS.uploadFile(parseFile).subscribe(
                    () => {
                        this.tableHeader = Object.keys(parseFile[0]);
                        this.files = parseFile;
                    },
                    (err) => {
                        console.log(err);
                    }
                )
            }
            fileReader.readAsArrayBuffer(file);
        }
    }

    validateUploadFile(event) {
        if (!event.length) {
            return false;
        }

        let fileExtension = event[0].name.slice(event[0].name.lastIndexOf('.'));

        if (fileExtension < 0) {
            return false;
        }

        if (event[0].size > this.maxFileSize) {
            this.statusFileText = "Допустимый размер файла 10Мб, выберите другой файл";
            return false;
        }

        if ( (fileExtension !== '.xls') && (fileExtension !== '.xlsx') ) {
            this.statusFileText = `Недопустимый тип файла "${fileExtension}", выберите другой файл`;
            return false;
        }

        this.statusFileText = `Файл - "${event[0].name}"`;
        return true; 
    }
}
