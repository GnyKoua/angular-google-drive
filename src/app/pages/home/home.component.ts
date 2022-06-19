import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as feather from 'feather-icons';
import * as $ from 'jquery';
import { GoogleDriveService } from 'src/app/services/google-drive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  ListeDossiers: any[] = [];

  constructor(
    private _gdriveService: GoogleDriveService
  ) { }

  ngOnInit(): void {
    this.getAllFolder();
  }

  ngAfterViewInit() {
    feather.replace();
  }


  onCreateFolder(form: NgForm) {
    this._gdriveService.createFolder(form.value.foldername)
      .then(res => {
        if (res) {
          this.getAllFolder().then(() => {
            $(function () {
              $('#newFolder .close').trigger("click");
            });
          });
        }
      });
  }

  private getAllFolder() {
    return new Promise((resolve, reject) => {
      this._gdriveService.listFolders().then(res => {
        this.ListeDossiers = res;
        resolve(res);
      });
    });
  }

}
