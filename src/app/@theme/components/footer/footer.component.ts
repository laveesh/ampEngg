import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"
      >AMP Engineers &#0169; 2019. All Right Reserved.</span
    >
    <div class="socials">
      <a
        href="mailto:ampengg.operations@gmail.com"
        target="_blank"
        class="ion ion-android-mail"
      ></a>
      <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
    </div>
  `
})
export class FooterComponent {}
