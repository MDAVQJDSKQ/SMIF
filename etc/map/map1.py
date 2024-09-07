import pandas as pd
import plotly.express as px

lead_states = ['CA', 'UT', 'MT', 'NY', 'MA', 'VA', 'NC']
impacted_states = ['SC', 'VT', 'CT', 'RI', 'NH', 'ME', 'ND', 'WY', 'ID', 'OR', 'AZ']

# Create a DataFrame of states and their colors
data = {
    'State': lead_states + impacted_states,
    'Color': ['#FFD700']*len(lead_states) + ['#FFF3B7']*len(impacted_states)  # Gold and lighter gold colors
}
df = pd.DataFrame(data)

# Create the choropleth map
fig = px.choropleth(
    df,
    locations='State',
    locationmode='USA-states',
    color='Color',
    scope='usa',
    color_discrete_map={'#FFD700': '#FFD700', '#FFF3B7': '#FFF3B7'},  # Gold and lighter gold colors
    category_orders={'Color': ['#FFD700', '#FFF3B7']}
)

# Update legend title and labels
fig.for_each_trace(lambda t: t.update(name='Lead States' if t.name == '#FFD700' else 'Impacted States'))
fig.update_layout(
    legend_title_text='Legend',
    legend=dict(
        font=dict(size=16),
        x=0.65,  # Adjust x position
        y=0.0,  # Adjust y position
        xanchor='center',
        yanchor='bottom'
    )
)

# Show the map
fig.show()