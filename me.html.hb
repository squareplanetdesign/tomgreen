<div>
    <span>{{name}}</span>
    {{#each titles}}
        <div>{{this}}</div>
    {{/each}}
    <ul>
    {{#each soundbytes}}
        <li>{{this}}</li>
    {{/each}}
    </ul>
</div>

<div>
    <label>Companies where I've worked:</label>
    <ul>
       {{#each companies}}
       <li>{{this}}</li>
       {{/each}}
    </ul>
</div>
<div>
    <label>Professional Social Media:</label>
    <ul>
        {{#each links}}
        <li>
            {{ this.url }}
        </li>
        {{/each}}
    </ul>
</div>

<div>
    <label>Soft Skills:</label>
    <ul>
        {{#each softskills}}
        <li>
            {{ this }}
        </li>
        {{/each}}
    </ul>
</div>

<div>
    <label>Technology:</label>
    <ul>
        {{#each technology}}
        <li>
            {{ this }}
        </li>
        {{/each}}
    </ul>
</div>
