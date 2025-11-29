# Screenshot Creation Guide for Airflow University Course

## 📸 Required Screenshots by Section

### **Chapter 1: Theoretical Foundations**

#### **Figure 1.1: Airflow Architecture Overview**
- **Location:** Welcome → Academic Context
- **Content:** High-level system architecture diagram
- **Requirements:**
  - Show all major components (Web Server, Scheduler, Metadata DB, Workers)
  - Include data flow arrows
  - Label component functions
  - Highlight distributed nature
- **Capture Method:** Create diagram using draw.io or similar tool
- **Dimensions:** 1200x800px minimum

#### **Figure 1.2: Component Interaction Diagram**
- **Location:** Welcome → Academic Context  
- **Content:** Detailed component communication flow
- **Requirements:**
  - Request/response patterns
  - Database read/write operations
  - Task execution workflow
  - Error handling paths
- **Capture Method:** Technical diagram creation
- **Dimensions:** 1400x1000px

#### **Figure 1.3: DAG Graph View**
- **Location:** Basics → DAG Implementation
- **Content:** Airflow Web UI showing DAG graph
- **Requirements:**
  - Clear DAG structure visualization
  - Task status indicators (green/red/yellow)
  - Task execution timing
  - Dependency arrows
- **Capture Instructions:**
  ```bash
  # 1. Start Airflow
  airflow standalone
  
  # 2. Navigate to http://localhost:8080
  # 3. Click on 'hello_world_dag' 
  # 4. Click 'Graph' view
  # 5. Capture full screen at 1920x1080
  # 6. Crop to show only graph area
  ```

#### **Figure 1.4: Task Instance Details**
- **Location:** Basics → DAG Implementation
- **Content:** Detailed task execution view
- **Requirements:**
  - Task logs visible
  - Execution duration shown
  - Context variables displayed
  - XCom data if available
- **Capture Instructions:**
  ```bash
  # 1. From DAG graph view
  # 2. Click on task node
  # 3. Select 'Task Instance Details'
  # 4. Show 'Logs' tab
  # 5. Capture with visible execution information
  ```

### **Chapter 2: DAG Mastery**

#### **Figure 2.1: DAG Configuration Interface**
- **Content:** DAG edit/creation interface
- **Requirements:**
  - Configuration parameters visible
  - Schedule interval settings
  - Default args configuration
  - Tags and description fields

#### **Figure 2.2: Complex DAG Dependencies**
- **Content:** Multi-task DAG with branching
- **Requirements:**
  - Parallel task execution
  - Conditional branching
  - Join points after branches
  - Multiple dependency patterns

#### **Figure 2.3: DAG Run Timeline**
- **Content:** Gantt chart view of DAG execution
- **Requirements:**
  - Task execution timeline
  - Duration visualization
  - Parallel execution demonstration
  - Critical path identification

### **Chapter 3: Operators & Hooks**

#### **Figure 3.1: Operator Catalog**
- **Content:** Available operators in Airflow UI
- **Requirements:**
  - Different operator types visible
  - Provider packages shown
  - Installation status indicated
  - Version information displayed

#### **Figure 3.2: Connection Configuration**
- **Content:** Admin → Connections interface
- **Requirements:**
  - Connection type dropdown
  - Configuration fields
  - Test connection functionality
  - Security considerations visible

#### **Figure 3.3: Custom Operator Code**
- **Content:** IDE view of custom operator implementation
- **Requirements:**
  - Class inheritance structure
  - Method implementations
  - Documentation strings
  - Type hints and annotations

### **Chapter 4: Scheduling & Triggers**

#### **Figure 4.1: Schedule Interval Configuration**
- **Content:** DAG scheduling interface
- **Requirements:**
  - Cron expression builder
  - Timezone settings
  - Start date configuration
  - Catchup settings

#### **Figure 4.2: Trigger Rules Demonstration**
- **Content:** DAG with different trigger rules
- **Requirements:**
  - Failed task scenarios
  - Trigger rule effects
  - Task state colors
  - Dependency resolution

#### **Figure 4.3: Calendar View**
- **Content:** DAG runs calendar interface
- **Requirements:**
  - Monthly calendar view
  - Run success/failure indicators
  - Historical execution patterns
  - Schedule adherence visualization

### **Chapter 5: Sensors & Monitoring**

#### **Figure 5.1: Sensor Configuration**
- **Content:** Sensor task configuration
- **Requirements:**
  - Sensor parameters
  - Polling settings
  - Timeout configuration
  - Mode selection (poke/reschedule)

#### **Figure 5.2: Monitoring Dashboard**
- **Content:** Airflow monitoring overview
- **Requirements:**
  - System health indicators
  - Task success/failure rates
  - Performance metrics
  - Resource utilization

#### **Figure 5.3: Alert Configuration**
- **Content:** Email/Slack alert setup
- **Requirements:**
  - Notification channels
  - Alert trigger conditions
  - Message templates
  - Escalation policies

## 🛠️ Technical Specifications

### **Image Quality Standards**
- **Resolution:** Minimum 1920x1080 for screenshots
- **Format:** PNG for screenshots, SVG for diagrams
- **Compression:** < 500KB per image
- **Color Depth:** 24-bit color minimum
- **Text Clarity:** All text must be readable at 100% zoom

### **Capture Settings**
```bash
# Recommended browser settings for screenshots
# Chrome/Firefox in incognito mode
# Zoom level: 100%
# Window size: 1920x1080
# Extensions disabled
# Clear cache before capture
```

### **Post-Processing Requirements**
1. **Crop appropriately** to show relevant content only
2. **Add annotations** where necessary (arrows, callouts)
3. **Ensure consistency** in styling across all images
4. **Optimize file size** without quality loss
5. **Add alt text** for accessibility

### **File Naming Convention**
```
figure_[chapter]_[section]_[description].png

Examples:
- figure_1_1_architecture_overview.png
- figure_2_3_dag_timeline_view.png
- figure_3_2_connection_config.png
```

### **Directory Structure**
```
Airflow_Website/
├── images/
│   ├── architecture/
│   │   ├── figure_1_1_architecture_overview.png
│   │   └── figure_1_2_component_interaction.png
│   ├── dags/
│   │   ├── figure_1_3_dag_graph_view.png
│   │   └── figure_1_4_task_details.png
│   ├── operators/
│   └── monitoring/
├── index.html
├── styles.css
└── ...
```

## 📝 Screenshot Annotation Guidelines

### **Callout Styles**
- **Red arrows** for critical elements
- **Blue boxes** for UI components
- **Yellow highlights** for important text
- **Numbered markers** for step-by-step processes

### **Text Overlays**
- **Font:** Arial, 14px minimum
- **Colors:** High contrast (white text on dark backgrounds)
- **Positioning:** Non-overlapping with UI elements
- **Consistency:** Same style across all images

## 🎯 Quality Checklist

Before adding screenshots to the course, verify:

- [ ] **Clarity:** All text is readable
- [ ] **Relevance:** Screenshot matches learning objective
- [ ] **Accuracy:** UI elements are current version
- [ ] **Consistency:** Styling matches other course images
- [ ] **Accessibility:** Alt text provided
- [ ] **Size:** File size optimized for web
- [ ] **Annotation:** Clear callouts where needed
- [ ] **Context:** Supports accompanying explanation

## 🔄 Update Process

### **Regular Maintenance**
1. **Quarterly Review:** Check for UI changes in Airflow updates
2. **Version Tracking:** Maintain screenshots for current LTS version
3. **Student Feedback:** Update based on clarity requests
4. **Technology Changes:** Refresh when significant UI updates occur

### **Version Control**
```bash
# Recommended Git LFS setup for images
git lfs track "*.png"
git lfs track "*.jpg"
git add .gitattributes
git commit -m "Add LFS tracking for images"
```

## 💡 Pro Tips for Educators

### **Creating Effective Screenshots**
1. **Use consistent browser zoom** (100%) across all captures
2. **Clear browser cache** before capturing to ensure clean UI
3. **Use sample data** that's meaningful and educational
4. **Capture during stable system state** (no loading spinners)
5. **Test on different screen sizes** to ensure visibility

### **Enhancing Learning Value**
1. **Add progressive disclosure** - show UI elements step by step
2. **Include error scenarios** - show what failure looks like
3. **Demonstrate best practices** - highlight good configuration
4. **Show real-world scale** - use realistic data volumes

### **Maintenance Strategy**
1. **Document screenshot sources** - note how each was created
2. **Maintain raw files** - keep uncompressed originals
3. **Version control** - track changes over time
4. **Student testing** - verify clarity with actual users

---

**Note:** This guide ensures all visual content meets university-level educational standards and provides clear, professional documentation for the Apache Airflow course.
