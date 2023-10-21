import { Component , ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../Apis/employee.service';
import { OrderService } from '../Apis/order.service';
import { OtherService } from '../Apis/other.service';
import { ChartConfiguration, ChartOptions,Chart, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
export interface data {
	[key: string]: any;}
@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent  {
@ViewChild('bottomofPage') bottomofPage: ElementRef;
@ViewChild('topOfTasks') topOfTasks : ElementRef;
	public barChartOptions: ChartConfiguration['options'] = {
		responsive: true,
		layout: {
		  padding: {
			left: 30
		  }
		},
		// We use these empty structures as placeholders for dynamic theming.
		scales: {
		  x: {},
		  y: {
			suggestedMin: 10,
			suggestedMax: 1000,
			ticks: {
			}
		  }
		},
		plugins: {
		  legend: {
			display: true,
			labels: {
			  color: 'white', // Set the color of the legend labels
			},
		  },
		  datalabels: {
			anchor: 'end',
			align: 'end',
			color:'white'
		  }
		}
	  };
	
		
	  public lineChartOptions: ChartOptions = {
		responsive: true,
		layout: {
		  padding: {
			left: 50
		  }
		},
		// ... other chart options
	  };
	  public barChartType: ChartType = 'bar';
	  public barChartPlugins = [
		DataLabelsPlugin
	  ]; 
	
	  public barChartData: ChartData<'bar'> = {
		labels: ['All Rejections', 'Late Completions', 'On-Time', 'Early', 'Total Tasks'],
		datasets: [
		  { data: [15, 25, 30, 11, 6], label: 'Last Year',
		  backgroundColor: 
			'#C2FFCF', 
		},
		  { data: [328, 148, 420, 19, 98], label: 'Current Year', backgroundColor:'#FFEB80' }
		]
	  };
	  // events
	  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
		console.log(event, active);
	  }
	
	  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
		console.log(event, active);
	  }
	
	  public randomize(): void {
		// Only Change 3 values
		this.barChartData.datasets[0].data = [
		  Math.round(Math.random() * 100),
		  59,
		  80,
		  Math.round(Math.random() * 100),
		  56,
		  Math.round(Math.random() * 100),
		  40];
	
		this.chart?.update();
	  }
	  title = 'ng2-charts-demo';

	limit = 5;
	public greeting: string;
	public barChartLegend = true;
	chart: any;
  
constructor(private elementref:ElementRef, private empSer:EmployeeService, private otherSer:OtherService,private order:OrderService){
	const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greeting = 'Good Afternoon';
    } else if (currentHour >= 18 && currentHour < 22) {
      this.greeting = 'Good Evening';
    } else {
      this.greeting = 'Good Night';
    }
	Chart.defaults.color = 'white'; 
    Chart.defaults.font.size = 14;
}
report:any[]=[];
toal_rejected_order_services:any;
late_order_services_complete:any;
ontime_order_services_complete:any;
early_order_service_complete:any;
orders:any[] = [];
completedOrders:any;
in_progress_orders:any;
total_orders:any;
userName='';
ngOnInit(){
  let data={
    tbl_employee_id: this.otherSer.sessionStorage.retrieve('empId')
}
  console.log('manager Dahboard data',data)
  this.empSer.managerDesboard(data).subscribe(res=>{
    console.log('manager Dahboard',res)
	this.report=res;
	this.toal_rejected_order_services=res[0].toal_rejected_order_services;
	this.late_order_services_complete=res[0].late_order_services_complete;
	this.ontime_order_services_complete=res[0].ontime_order_services_complete;
	this.early_order_service_complete=res[0].early_order_service_complete;
	this.updateChartValues();

  });
	this.getAllOrders()

}
receiveUserName(e:any){
this.userName=e;
}
getAllOrders(){
	this.order.getAllOrders().subscribe((res) => {
		console.log('orders', res);
		this.orders = res
		
	  });
  }
  showMore() {
    this.limit = this.orders.length;
	setTimeout(() => {
		this.bottomofPage.nativeElement.scrollIntoView({ behavior: 'smooth'});
	}, 500); 
  }
  showLess() {
	setTimeout(() => {
		this.topOfTasks.nativeElement.scrollIntoView({behavior: 'smooth'});
	}, 700);
    this.limit = 5;
  }

  updateChartValues() {
    const newData = [this.toal_rejected_order_services, this.late_order_services_complete, this.ontime_order_services_complete, this.early_order_service_complete,this.orders];
    this.barChartData.datasets[1].data = newData;
    this.chart?.update();
  }
}
