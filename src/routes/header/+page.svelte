<script>

</script>

<div>
    <h1>Hello user!</h1>
    <p>Welcome back!</p>
    
    <h1>TRM</h1>
</div>


<div>
    <div>
        <h1>10</h1>
        <h1>TOTAL</h1>
    </div>

    <div>
        <h1>20</h1>
        <h1>IN PROGRESS</h1>
    </div>

    <div>
        <h1>30</h1>
        <h1>COMPLETED</h1>
    </div>
</div>


<form>
    <input type="text" placeholder="Search.." name="search">
    <button type="submit"></button>
</form>

<form>
    <label for="title">Title:</label>
    <input type="text" id="title" name="title"><br>

    <label for="object">Object:</label>
    <input type="text" id="object" name="object"><br>
  
    <label for="deadline">Deadline:</label>
    <input type="date" id="deadline" name="deadline"><br>
    
    <label for="priority">Priority:</label>
    <select id="priority" name="priority">
        <option value="Urgent">Urgent</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
        <option value="None">None</option>
    </select><br>

    <input type="submit" value="Submit">
</form>