import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { AgeCalculatorPipe } from './pipes/age-calculator.pipe';



@Component({
  selector: 'sysmoui-dob',
  templateUrl: './sysmoui-dob.component.html',
  imports:[IonicModule,FormsModule,CommonModule,ReactiveFormsModule,AgeCalculatorPipe],
   providers:[
      {
      provide:NG_VALUE_ACCESSOR,
      useExisting:SysmoDob,
      multi:true
      },
  ],
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SysmoDob  implements OnInit,ControlValueAccessor {

  @Input() ageText!:string
  @Input() customClassInput: string | string[] | { [key: string]: string } = '';
  @Input() customStyleText: {[key:string]:string}={}

  dateOfBirth!:string
  minDate!:string
  maxDate!:string
   onChange:(dateOfBirth:string)=>void=()=>{};
   onTouched: () => void = () => {};

  selectedDateOfBirth(event:Event){
  try{
  const input = event.target as HTMLInputElement;
  this.dateOfBirth=input.value
  this.onChange(this.dateOfBirth)
}catch(error){
  console.error(error)
}


}
  constructor() { }
 
 
  writeValue(obj: string): void {
    console.log(obj)
    this.dateOfBirth=obj
    
  }
  registerOnChange(fn: any): void {
    this.onChange=fn
    
  }
  registerOnTouched(fn: any): void {
    this.onTouched=fn 
    
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }
  handleBlur(){
    this.onTouched()
  }
  ngOnInit() {
    //To restrict to choose age bellow 18 and above 60
    const currentyear=new Date().getFullYear()
    this.minDate=`${currentyear-60}-01-01`
    this.maxDate=`${currentyear-18}-12-31`
    console.log(this.dateOfBirth)
  }


}


