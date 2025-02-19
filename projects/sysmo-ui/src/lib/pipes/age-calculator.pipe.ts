import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageCalculator',
  standalone: true
})
export class AgeCalculatorPipe implements PipeTransform {

  
   transform(dateOfBirth: string) {
     let age;
     try{
       if(dateOfBirth){
       const currentDate=new Date()
       const dob = new Date(dateOfBirth)
       age=currentDate.getFullYear()-dob.getFullYear()
       //check the birthday of the current year to return exact age
       if(currentDate.getMonth()<dob.getMonth() || 
       currentDate.getMonth()===dob.getMonth() && 
       currentDate.getDate()<dob.getDate()){
         age--
       }
     } 
     }catch(error){
       console.error(error)
     }
     console.log(age)
     return age
   }
   }